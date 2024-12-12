"use client";

import { usePathname } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"


const NavItems = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => {
  const isActive = usePathname() === href


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${isActive ? 'bg-brand-primary text-brand-light' : 'text-gray-400 hover:text-brand-light'
              }`}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only bg-brand-primary">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NavItems;