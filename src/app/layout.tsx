import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Providers from "./providers";
import { PropsWithChildren } from "react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carbon-Ledger",
  description: "A Carbon Credit Marketplace powered by blockchain",
};

export const viewport = {
  width: "device-width",
  initialScale: "1",
  shrinkToFit: "no",
};

export default function RootLayout({
  children,
}: Readonly<PropsWithChildren<{}>>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      <html
        lang="en"
        className={`${ubuntu.variable} dark`}
        data-theme="dark"
        style={{ colorScheme: "dark" }}
      >
        <body>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
