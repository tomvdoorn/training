import AllTemplatesUser from "~/components/app/workouts/AllTemplatesUsers";
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation"



export default async function Component() {
  const user = await getCurrentUser()
  if (!user) {
    return notFound()
  }
  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
        <AllTemplatesUser user_id = {user.id}/>
        </div>
        
      </div>
    </>
  )
}
