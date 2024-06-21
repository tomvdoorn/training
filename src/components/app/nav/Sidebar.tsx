"use client"
import { Home, LineChart, Package, Settings, ShoppingCart, Users2 } from "lucide-react"
import Link from "next/link"

import { BRAND } from '../../../config/name'
import { Icons } from '../../Icons'
import  NavItems  from './NavItem'

const Sidebar = () =>{

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Icons.logo className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">{BRAND.name}</span>
        </Link>
        <NavItems href="/app" icon={Home} label="Dashboard" />
        <NavItems href="/app/workouts" icon={ShoppingCart} label="Workouts" />
        <NavItems href="/app/schedule" icon={Package} label="Schedule" />
        <NavItems href="/app/customers" icon={Users2} label="Customers" />
        <NavItems href="/app/analytics" icon={LineChart} label="Analytics" />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItems href="/app/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  )
}

export default Sidebar
