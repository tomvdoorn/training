import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { Inter as FontSans } from "next/font/google"

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { BRAND } from "~/config/name";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: BRAND.name,
  description: "Share the pain and grow together fuelled by the best AI coaches",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: { url: "/favicon.ico" },
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ],
  },
  manifest: "/site.webmanifest",
  mobileWebApp: {
    title: BRAND.name
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "relative h-full font-sans antialiased bg-brand-dark text-brand-light",
          fontSans.variable
        )}>
        <main className=" flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex-1">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
        </main>
      </body>
    </html>
  );
}