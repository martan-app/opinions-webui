import { Box, Flex, Text } from "@mantine/core"
import { usePostHog } from "posthog-js/react"
import { useContext, useEffect, useRef, useState } from "react"

import { Logo } from "../components/Logo"
import { LogoMartan } from "../components/LogoMartan"
import Products from "../components/Products"

import NotificationsComponent, {
  NotificationsHandle,
} from "../components/notifications"

import { getServerSideProps } from "../server-side-props/reviews"

import { AuthorContext } from "./../context/notification"

interface HomeProps {
  notification: any
}

export default function Home({ notification }: HomeProps) {
  const [show, __show] = useState(false)
  const posthog = usePostHog()

  const { __author } = useContext<any>(AuthorContext)
  const $alert = useRef<NotificationsHandle>(null)

  useEffect(() => {
    setTimeout(() => {
      __show(true)
    }, 100)
  }, [])

  useEffect(() => {
    __author(notification?.customers?.name)
  }, [__author, notification?.customers?.name])

  useEffect(() => {
    if (notification?.customers) {
      const { id, name } = notification?.customers
      posthog.identify(id, {
        name,
      })
    }
  }, [posthog, notification?.customers])

  if (!notification || !show) {
    return null
  }

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Flex
        sx={{
          maxWidth: "700px",
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

        <Text fz="xl" p="xl" align="center">
          {notification?.productBody?.length > 1
            ? "O que achou dos produtos?"
            : "O que achou do produto?"}{" "}
          Outras pessoas já avaliaram.
        </Text>

        <Products
          products={notification.productBody}
          notification={notification}
        />

        <Text italic c="dimmed" span p="xs" align="center">
          © {new Date().getFullYear()} {notification?.stores?.name}.
        </Text>
      </Flex>

      <LogoMartan store={notification?.stores?.name} />

      <NotificationsComponent ref={$alert} />
    </Box>
  )
}

export { getServerSideProps }
