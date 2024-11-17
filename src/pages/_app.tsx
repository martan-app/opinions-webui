import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { AuthorContext } from "./../context/notification";
import { useEffect, useState } from "react";
import "./assets/style.css";
import "@smastrom/react-rating/style.css";
import Script from "next/script";
import { clarity } from "react-microsoft-clarity";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [author, __author] = useState("");

  useEffect(() => {
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });

    document.addEventListener("touchmove", function (e) {
      e.preventDefault();
    });

    clarity.init("kugnxhmp7p");
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

      {/* <Script id="clarity" strategy="lazyOnload" crossOrigin="use-credentials">
        {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "kugnxhmp7p");`}
      </Script> */}

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
