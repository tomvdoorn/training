"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"



const Settings = () => {
      const isActive = usePathname() 

return( 
      <nav
                  className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                >
                  <Link href="/app/settings/" 
                  className={` ${
                isActive === "/app/settings" ? 'font-semibold text-primary' : ''
              }`}>
                    General
                  </Link>
                  <Link href="/app/settings/security" className={` ${
                isActive === "/app/settings/security" ? 'font-semibold text-primary' : ''
              }`}>Security</Link>
                  <Link href="/app/settings/support" className={` ${
                isActive === "/app/settings/support" ? 'font-semibold text-primary' : ''
              }`}>Support</Link>

                </nav>
)
}

export default Settings