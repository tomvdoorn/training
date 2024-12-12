import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
  appleWebApp: {
    title: "TrainTogether"
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "font-sans antialiased bg-brand-dark text-brand-light relative flex flex-col min-h-screen justify-center",
        fontSans.variable
      )}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-brand-dark">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-brand-gradient-br opacity-20 blur-[80px]"></div>

        </div>
        <Image src="/logo.png" alt="Logo" width={100} height={100} className="mx-auto w-15 h-15 rounded-full " />
        <h1 className="text-brand-light text-4xl font-bold text-center pb-5 pt-5">ToTrain</h1>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  )
}
