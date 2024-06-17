import { signOut as nextAuthSignOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useAuth = () => {
  const router = useRouter()

  const signOut = async () => {
    try {
      await nextAuthSignOut({
        redirect: false,
      })

      toast.success('Signed out successfully')

      router.push('/auth/sign-in')
      router.refresh()
    } catch (err) {
      toast.error("Couldn't sign out, please try again.")
    }
  }

  return { signOut }
}
