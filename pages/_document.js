import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ThemeScriptTag } from 'use-theme-switcher';


class MyDocument extends Document {
    static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossOrigin="anonymous" />
                </Head>
                <body>
                    <ThemeScriptTag defaultDarkTheme="theme-dark" defaultLightTheme="theme-light" />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument