import { createGetInitialProps } from "@mantine/next"
import Document, { Head, Html, Main, NextScript } from "next/document"

const getInitialProps = createGetInitialProps()

class AppDocument extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html>
        <Head />
        <body style={{ touchAction: 'none' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
