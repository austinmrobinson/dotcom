import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Austin Robinson",
    default: "Austin Robinson",
  },
  description: `Software designer and engineer`,
  metadataBase: new URL("https://austinmrobinson.com"),
  openGraph: {
    title: "Austin Robinson",
    description: `Software designer and engineer`,
    url: "https://austinmrobinson.com",
    siteName: "Austin Robinsons's site",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Austin Robinson",
    card: "summary_large_image",
    creator: "@austinmrobinson",
  },
  icons: {
    shortcut: "/favicon-96.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center min-h-dvh text-sm transition-colors duration-300 text-neutral-600 focus:outline-none focus:ring focus:ring-neutral-500 bg-neutral-100 dark:text-neutral-300 dark:bg-neutral-900">
        <Header />
        <main className="flex flex-col grow h-full mt-14 container max-w-screen-sm px-6 pt-8 sm:pt-[72px] pb-8 sm:pb-24">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
