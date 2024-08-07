import { TRPCReactProvider } from "~/trpc/react"
import "~/styles/globals.css";
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import { Toaster } from "~/components/ui/toaster";
import Settings from "~/components/app/settings/SettingsNav";
  


export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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

    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Settings />
          <div className="grid gap-6">
             <TRPCReactProvider>
            {children}
            </TRPCReactProvider>
            <Toaster/>
          </div>
        </div>
      </main>
    </div>
 
  );
}
