import { MantineProvider } from "@mantine/core"
import "@smastrom/react-rating/style.css"
import { AppProps } from "next/app"
import Head from "next/head"
import { Router } from "next/router"
import Script from "next/script"
import posthog from "posthog-js"
import { useEffect, useState } from "react"
import { clarity } from "react-microsoft-clarity"
import { AuthorContext } from "./../context/notification"
import { PostHogProvider } from "posthog-js/react"
import "./assets/style.css"

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const [author, __author] = useState("")

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: "https://us.i.posthog.com",
      ui_host: "https://us.posthog.com",
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          posthog.debug()
        }
      },
    })

    const handleRouteChange = () => posthog?.capture("$pageview")

    Router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault()
    })

    document.addEventListener("touchmove", function (e) {
      e.preventDefault()
    })

    clarity.init("kugnxhmp7p")
  }, [])

  return (
    <>
      <Head>
        <title>
          {pageProps?.notification?.stores?.name
            ? `${pageProps?.notification?.stores?.name} - Avaliação de produtos`
            : "Martan.app - Avaliações"}
        </title>

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </Head>

      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-HR4YE1LY6M"
      />

      <Script id="gtag" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HR4YE1LY6M');
            `}
      </Script>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <PostHogProvider client={posthog}>
          <AuthorContext.Provider value={{ author, __author }}>
            <Component {...pageProps} />
          </AuthorContext.Provider>
        </PostHogProvider>
      </MantineProvider>
    </>
  )
}
