import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { AuthorContext } from "./../context/notification";
import { useEffect, useState } from "react";
import "./assets/style.css";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [author, __author] = useState("");

  useEffect(() => {
    document.addEventListener("gesturestart", function (e) {
      console.log(e);
      e.preventDefault();
    });

    document.addEventListener("touchmove", function (e) {
      console.log(e);

      e.preventDefault();
    });
  }, []);
  
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
  );
}
