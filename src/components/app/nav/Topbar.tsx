
import { Button } from "@/components/ui/button"
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2
} from "lucide-react"
import { getServerSession } from 'next-auth/next'
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { authOptions } from '../../../app/api/auth/[...nextauth]/route'
import TopbarUser from "./TopbarUser"

const Topbar = async () => {
  const session = await getServerSession(authOptions)

  return (
<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
<Sheet>
  <SheetTrigger asChild>
    <Button size="icon" variant="outline" className="sm:hidden">
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="sm:max-w-xs">
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="#"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
      >
        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Home className="h-5 w-5" />
        Dashboard
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 px-2.5 text-foreground"
      >
        <ShoppingCart className="h-5 w-5" />
        Orders
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Package className="h-5 w-5" />
        Products
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Users2 className="h-5 w-5" />
        Customers
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <LineChart className="h-5 w-5" />
        Settings
      </Link>
    </nav>
  </SheetContent>
</Sheet>
<div className="relative ml-auto flex-1 md:grow-0">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search..."
    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
  />
</div>
<TopbarUser />
</header>
  );
}

export default Topbar