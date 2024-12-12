"use client"
import Link from "next/link"
import { BRAND } from '@/config/name'
import { navigationItems } from '@/config/navigation'
import NavItems from './NavItem'
import Image from 'next/image'
const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r border-gray-800 bg-brand-dark sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/app"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-brand-light md:h-8 md:w-8 md:text-base"
        >
          <Image
            src="/favicon.svg"
            alt={BRAND.name}
            width={48}
            height={48}
            className="transition-all group-hover:scale-110 rounded-full"
          />          <span className="sr-only">{BRAND.name}</span>
        </Link>
        {navigationItems.map((item) => (
          <NavItems key={item.href} href={item.href} icon={item.icon} label={item.label} />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
