import { log } from "@logtail/next";
import { verify } from "jsonwebtoken";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const token = process.env.NOTIFICATION_TOKEN ?? "";
  let decodedToken: any = null;

  if (query.t && query.notification) {
    try {
      decodedToken = verify(query.t || "", token);
      const headers = new Headers();
      headers.append("X-Store-Id", decodedToken.store_id);
      headers.append("X-Token", query.t);
      headers.append("Content-Type", "application/json");

      const reqOptions = {
        method: "get",
        headers,
      };

      const urlReviews = new URL(
        "/v1/notifications/" + query.notification,
        process.env.CORE_API
      );

      const req = await fetch(urlReviews.toString(), reqOptions);

      const res: any = await req.json();

      if (!req.ok) {
        log.error("Opinions-Webui: Notifications Resquest Failed", {
          erroCode: 1799,
          req,
          res,
        });
        return {
          redirect: {
            permanent: false,
            destination: "/error?reason=1799",
          },
        };
      }

      if (decodedToken.store_id !== res.notification.store_id) {
        log.error("Opinions-Webui: storeId diferente from token", {
          erroCode: 1800,
          res,
          decodedToken,
        });
        return {
          redirect: {
            permanent: false,
            destination: "/error?reason=1800",
          },
        };
      }

      let notificationBody: any = {
        store_id: parseInt(decodedToken.store_id, 10),
        id: query.notification,
        order_ref: decodedToken.order_id,
        order_id: decodedToken.order_id,
      };

      if (res.notification) {
        if (res?.order?.products) {
          notificationBody.productBody = res.order.products;
        }

        if (res?.reviews) {
          notificationBody.reviews = res.reviews;
        }

        notificationBody.stores = res.store;
        notificationBody.customers = res.customer;
      }

      return {
        props: {
          notification: notificationBody,
          decodedToken,
        },
      };
    } catch (error: any) {
      log.error("Opinions-Webui: request failed", {
        erroCode: 1801,
        error,
      });
      return {
        redirect: {
          permanent: false,
          destination: "/error?reason=1801&e" + error.toString(),
        },
      };
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: "/error?reason=1802",
    },
  };
}
