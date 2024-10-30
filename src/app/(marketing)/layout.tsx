import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { Inter as FontSans } from "next/font/google"

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "TrainTogether",
  description: "Share the pain and grow together fuelled by the best AI coaches",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body 
        className={cn(
        "relative h-full font-sans antialiased grainy light",
        fontSans.variable
      )}>
        <main className="relative flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex-1">
            
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
        </main>
      </body>
    </html>
  );
}