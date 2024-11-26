import { getCurrentUser } from "~/lib/session"
import UserSettings from "~/components/app/settings/UserSettings"
export default async function Dashboard() {
  const user = await getCurrentUser()

  interface UserSettingsProps {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  }
  if (!user) {
    return <div>Loading...</div> // Or handle the case when user is not available
  }

  const userSettings: UserSettingsProps = {
    id: user.id ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
  }

  return (
    <div className="">
      <UserSettings {...userSettings} />
    </div>
  )
}