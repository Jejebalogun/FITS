import type { Metadata } from "next";
import { Archivo_Black, Inter, Space_Mono } from "next/font/google";

import { SessionProvider } from "@/components/auth/SessionProvider";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FITS — Fashion Indigenous Trends & Styles",
  description:
    "The home of African craft, worn worldwide. Discover, order and receive authentic indigenous fashion and craft, direct from the makers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        {/* Signed-in state is read on every page, marketing and marketplace alike. */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
