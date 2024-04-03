import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Austin Robinson",
  description:
    "Austin Robinson's website, showing his work history. Contact if you need someone who builds apps, websites, or specializes in design systems.",
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
