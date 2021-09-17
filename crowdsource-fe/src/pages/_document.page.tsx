import Document, { Html, Head, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';

interface WithRouterProps {
  router: NextRouter;
}

interface MyDocumentProps extends WithRouterProps {}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Rowdies:400,700&display=swap"
          />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default withRouter(MyDocument);
