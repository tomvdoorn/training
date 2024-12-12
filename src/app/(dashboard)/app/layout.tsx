import Sidebar from "~/components/app/nav/Sidebar"
import Topbar from "~/components/app/nav/Topbar"
import { TRPCReactProvider } from "~/trpc/react"
import "~/styles/globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "~/lib/utils";
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import { Toaster } from "~/components/ui/toaster";
import { Viewport } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: "TrainTogether",
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
  mobileWebAppCapable: {
    title: "TrainTogether"
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser()
  if (!user) {
    return notFound()
  }
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased bg-brand-dark text-brand-light",
          fontSans.variable
        )}>

        <div className="flex min-h-screen w-full flex-col">
          <Sidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <TRPCReactProvider>
              <Topbar />
              <main>
                {children}
              </main>
            </TRPCReactProvider>
            <Toaster />
          </div>
        </div>

      </body>
    </html>
  );
}
