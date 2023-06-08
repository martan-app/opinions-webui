import { verify } from "jsonwebtoken"
import supabase from "../utils/supabase-client"

export async function getServerSideProps(context: any) {
  const { query } = context
  const token = process.env.NOTIFICATION_TOKEN ?? ""
  let decodedToken: any = null

  if (query.t && query.notification) {
    try {
      decodedToken = verify(query.t || "", token)
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: "/not-valid?reason=expired",
        },
      }
    }

    const { data, error: notErr } = await supabase
      .from("notifications")
      .select(
        `
      id,
      orders(id, order_id, products),
      customers(name, id),
      stores(name, url, logo_url),
      order_id,
      store_id,
      status,
      token,
      reviews
    `
      )
      .eq("id", query.notification)

    if (notErr || !data.length) {
      return {
        redirect: {
          permanent: false,
          destination: "/not-found",
        },
      }
    }

    if (
      decodedToken.store_id !== data[0].store_id ||
      query.t !== data[0].token
    ) {
      return {
        redirect: {
          permanent: false,
          destination: "/not-valid?reason=storeId,token",
        },
      }
    }

    const notificationBody: any = data[0]

    if (notificationBody) {
      const { data: products } = await supabase
        .from("products")
        .select("id, name, sku, url, pictures, product_id")
        .in("id", notificationBody.orders.products)

      if (products) {
        notificationBody.productBody = products
      }

      // reviews
      if (notificationBody?.reviews?.length) {
        const { data: reviews } = await supabase
          .from("reviews")
          .select("id, product_id, status, rating")
          .in("id", notificationBody.reviews)

        if (reviews && reviews.length > 0) {
          notificationBody.reviews = reviews
        }
      }
    }

    return {
      props: {
        notification: notificationBody,
        decodedToken,
      },
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: "/not-found",
    },
  }
}
