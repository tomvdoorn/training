import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "TrainTogether",
  description: "Share the pain and grow together fuelled by the best AI coaches",
  icons: [{ rel: "icon", url: "/favicon.ico" },
    // { rel: "apple-touch-icon", sizes: "57x57", href: "/favicon-57x57.png" },
    // { rel: "apple-touch-icon", sizes: "60x60", href: "/favicon-60x60.png" },
    // { rel: "apple-touch-icon", sizes: "72x72", href: "/favicon-72x72.png" },
    // { rel: "apple-touch-icon", sizes: "76x76", href: "/favicon-76x76.png" },
    // { rel: "apple-touch-icon", sizes: "114x114", href: "/favicon-114x114.png" },
    // { rel: "apple-touch-icon", sizes: "120x120", href: "/favicon-120x120.png" },
    // { rel: "apple-touch-icon", sizes: "144x144", href: "/favicon-144x144.png" },
    // { rel: "apple-touch-icon", sizes: "152x152", href: "/favicon-152x152.png" },  
    // { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon-180x180.png" },
    // { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    // { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
    // { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    // { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
    // { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192x192.png" },
    // { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
    // { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    // { name: "msapplication-TileColor", content: "#ffffff" },
    // { name: "msapplication-TileImage", content: "/favicon-144x144.png" },
    // { name: "msapplication-config", content: "/browserconfig.xml" },
    // { rel: "manifest", href: "/manifest.json" },
    // { name: "theme-color", content: "#ffffff" },
  ],
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body  className={cn(
        "font-sans antialiased grainy relative flex flex-col min-h-screen justify-center",
        fontSans.variable
       )}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
      <Toaster/>
      </body>
    </html>
  )
}
