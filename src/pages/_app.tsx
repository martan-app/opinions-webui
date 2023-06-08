import { AppProps } from "next/app"
import Head from "next/head"
import { MantineProvider } from "@mantine/core"
import { AuthorContext } from "./../context/notification"
import { useState } from "react"
export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const [author, __author] = useState("")

  return (
    <>
      <Head>
        <title>
          {pageProps?.notification?.stores?.name} - Avaliação de produtos
        </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <AuthorContext.Provider value={{ author, __author }}>
          <Component {...pageProps} />
        </AuthorContext.Provider>
      </MantineProvider>
    </>
  )
}
