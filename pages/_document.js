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
                <Head />
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