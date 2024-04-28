import { Box, Button, Flex, Text } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { Logo } from "../components/Logo";
import Products from "../components/Products";
import NotificationsComponent, {
  NotificationsHandle,
} from "../components/notifications";
import { AuthorContext } from "./../context/notification";
import { getServerSideProps } from "../server-side-props/reviews";
import { LogoMartan } from "../components/LogoMartan";

export default function Home(props: any) {
  const { __author } = useContext<any>(AuthorContext);
  const { notification, decodedToken } = props;
  const $alert = useRef<NotificationsHandle>(null);
  const [show, __show] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      __show(true);
    }, 100);
  }, []);

  useEffect(() => {
    __author(notification?.customers?.name);
  }, [__author, notification?.customers?.name]);

  if (!notification || !decodedToken || !show) {
    return null;
  }
  
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Flex
        sx={{
          maxWidth: "590px",
          width: "100%",
          margin: "25px auto",
          //background: "#fff",
        }}
        mih={50}
        gap="xl"
        justify="flex-start"
        align="center"
        direction="column"
        wrap="wrap"
      >
        {notification?.stores?.logo_url && (
          <Logo src={notification.stores.logo_url} />
        )}

        <Text p="xl" align="center">
          {notification?.productBody?.length > 1
            ? "O que achou dos produtos?"
            : "O que achou do produto?"}{" "}
          Outras pessoas já avaliaram.
        </Text>

        <Products
          products={notification.productBody}
          notification={notification}
        />

        <Text span p="xl" align="center">
          © {new Date().getFullYear()} {notification?.stores?.name}. Todos os
          direitos reservados.
        </Text>
      </Flex>

      <LogoMartan />

      <NotificationsComponent ref={$alert} />
    </Box>
  );
}

export { getServerSideProps };
