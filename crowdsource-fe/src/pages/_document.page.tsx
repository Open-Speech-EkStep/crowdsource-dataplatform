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
      <Html lang={this.props.locale} className="h-100">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Rowdies:300,400,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
          />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=G-3B78XVT75C`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3B78XVT75C', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body className="d-flex flex-column">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default withRouter(MyDocument);
