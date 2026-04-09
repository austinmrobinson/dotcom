import type { Metadata } from "next";
import { Lora, Merriweather } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "./utils/cn";
import { Toaster } from "@/app/components/ui/sonner";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const merriweatherHeading = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s • Austin Robinson",
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
    <html lang="en" className={cn(lora.variable, merriweatherHeading.variable, "font-serif")}>
      <body
        className={cn(
          "flex flex-col items-center min-h-[100vh] text-sm transition-colors duration-300 text-text-secondary bg-background"
        )}
      >
        <main className="flex flex-col grow h-full w-full p-6 sm:p-10">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
