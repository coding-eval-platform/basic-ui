import Document, { Head, Main, NextScript } from 'next/document'
export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    return await Document.getInitialProps(ctx)
  }


  render() {
    const styles = {
      margin: '0px',
    }

    return (
      <html lang="en">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body style={styles}>
          <Main />
        <NextScript />
        </body>
      </html >
    )
  }
}
