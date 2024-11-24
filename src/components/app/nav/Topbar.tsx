"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeft, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import TopbarUser from "./TopbarUser"
import { navigationItems } from "@/config/navigation"
import { BRAND } from '@/config/name'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SearchResults from "./SearchResults"
import { useDebounce } from "~/hooks/useDebounce"
import { api } from "~/trpc/react"

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const router = useRouter()

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  const { data: searchResults } = api.search.searchUsersAndTemplates.useQuery(
    { term: debouncedSearchTerm },
    { enabled: debouncedSearchTerm.length > 2 }
  )

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/app"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
              onClick={() => handleLinkClick("/app")}
            >
              <Image
                src="/favicon.svg"
                alt={BRAND.name}
                width={48}
                height={48}
                className="transition-all group-hover:scale-110 rounded-full"
              />              <span className="sr-only">{BRAND.name}</span>
            </Link>
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleLinkClick(item.href)}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users or templates..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults && searchResults.length > 0 && (
          <SearchResults results={searchResults} onClose={() => setSearchTerm("")} />
        )}
      </div>
      <TopbarUser />
    </header>
  );
}

export default Topbar
