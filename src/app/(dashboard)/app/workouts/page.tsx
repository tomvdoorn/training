import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"
import WorkoutPageContent from "~/components/app/workouts/WorkoutPageContent"

export default async function WorkoutPage() {
  const user = await getCurrentUser()
  if (!user) {
    return notFound()
  }
  return <WorkoutPageContent userId={user.id} />
}
