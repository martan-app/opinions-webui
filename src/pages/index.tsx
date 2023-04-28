import { Box, Button, Flex, Text, MantineProvider } from "@mantine/core";
import { verify } from "jsonwebtoken";
import { useRef } from "react";
import supabase from "../utils/supabase-client";
import { Logo } from "../components/Logo";
import NotificationsComponent, {
  NotificationsHandle,
} from "../components/notifications";
import Products from "../components/Products";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const token = process.env.NOTIFICATION_TOKEN || "";
  let decodedToken: any = null;

  if (!query.t || !query.notification) {
    return {
      redirect: {
        permanent: false,
        destination: "/not-found",
      },
    };
  }

  try {
    decodedToken = verify(query.t || "", token);
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/not-valid?reason=expired",
      },
    };
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
    .eq("id", query.notification);

  if (notErr || !data.length) {
    return {
      redirect: {
        permanent: false,
        destination: "/not-found",
      },
    };
  }

  if (decodedToken.store_id !== data[0].store_id || query.t !== data[0].token) {
    return {
      redirect: {
        permanent: false,
        destination: "/not-valid?reason=storeId,token",
      },
    };
  }

  const notificationBody: any = data[0];

  if (notificationBody) {
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name, sku, url, pictures, product_id")
      .in("id", notificationBody.orders.products);

    if (products) {
      notificationBody.productBody = products;
    }

    // reviews
    if (notificationBody.reviews && notificationBody.reviews.length) {
      const { data: reviews, error: revErr } = await supabase
        .from("reviews")
        .select("id, product_id, status, rating")
        .in("id", notificationBody.reviews);

      if (reviews && reviews.length > 0) {
        notificationBody.reviews = reviews;
      }
    }
  }

  return {
    props: {
      notification: notificationBody,
      decodedToken,
    },
  };
}

export default function Home(props: any) {
  const { notification } = props;
  const $alert = useRef<NotificationsHandle>(null);

  function renderButton() {
    if (!notification?.stores?.url) {
      return null;
    }

    return (
      <a target="_blank" href={notification.stores.url} rel="noreferrer">
        <Button>Acessar site</Button>
      </a>
    );
  }

  return (
    <MantineProvider
      theme={{
        colors: {
          brand: [
            "#DC493A",
            "#4392F1",
            "#ECE8EF",
            "#E3EBFF",
            "#E7F0FF",
          ],
        },
        primaryColor: "brand",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Flex
          sx={{
            maxWidth: "590px",
            width: "100%",
            margin: "50px auto",
            background: "#fff",
          }}
          mih={50}
          gap="xl"
          justify="flex-start"
          align="center"
          direction="column"
          wrap="wrap"
        >
          {notification.stores && notification.stores.logo_url && (
            <Logo src={notification.stores.logo_url} />
          )}

          <Text span p="xl" align="center">
            Sua avaliação é fundamental e pode ajudar outros Clientes a saberem
            mais sobre a qualidade dos produtos. Obrigado por sua contribuição ;
          </Text>

          <Products
            products={notification.productBody}
            notification={notification}
            alertComponent={$alert.current}
          />

          <Text span p="xl" align="center">
            Você pode cancelar o recebimento dos comunicados relacionados as
            avaliacoes nos e-mails enviados.
          </Text>

          {renderButton()}

          <Text span>
            © {new Date().getFullYear()}{" "}
            {notification.stores && notification.stores.name}. Todos os direitos
            reservados.
          </Text>
        </Flex>

        <NotificationsComponent ref={$alert} />
      </Box>
    </MantineProvider>
  );
}
