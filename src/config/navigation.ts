import { Home, LineChart, Settings, Dumbbell, CalendarDays, ShoppingBag } from "lucide-react"

export const navigationItems = [
  { href: "/app", icon: Home, label: "Dashboard" },
  { href: "/app/workouts", icon: Dumbbell, label: "Workouts" },
  { href: "/app/schedule", icon: CalendarDays, label: "Schedule" },
  { href: "/app/store", icon: ShoppingBag, label: "Store" },
  { href: "/app/analytics", icon: LineChart, label: "Analytics" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
]

