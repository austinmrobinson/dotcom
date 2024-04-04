import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Austin Robinson",
    default: "Austin Robinson",
  },
  description: "Full-stack developer.",
  openGraph: {
    title: "Austin Robinson",
    description: `Austin Robinson's website, showing his work history. Contact if you need someone who builds apps, websites, or specializes in design systems.`,
    url: "https://austinmrobinson.com",
    siteName: "Austin Robinsons's site",
    locale: "en_US",
    type: "website",
    // To use your own endpoint, refer to https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation
    // Note that an official `app/` solution is coming soon.
    images: [
      {
        url: `/og-image.jpg
          "Austin Robinsons's site"
        )}`,
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
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
        <main className="flex flex-col grow h-full mt-14 container max-w-screen-sm px-6 pt-[72px] pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}
