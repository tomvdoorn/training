"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState, useRef } from "react"
import { api } from "~/trpc/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createAuthenticatedClient, supabase } from "~/utils/supabase"
import { toast } from "~/components/ui/use-toast"
import { Camera } from "lucide-react"
import { getCurrentUser } from "~/lib/session"
import { getSession } from "next-auth/react"

interface User {
  id: string,
  firstName: string,
  lastName: string,
  email?: string,
  image?: string | null,
}

export default function UserSettings({ id, firstName, lastName, email, image }: User) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [userDetails, setUserDetails] = useState<User>({
    id,
    firstName,
    lastName,
    email,
    image,
  })

  useEffect(() => {
    setUserDetails({
      id,
      firstName,
      lastName,
      email,
      image,
    })
  }, [id, firstName, lastName, email, image])

  const updateUserMutation = api.user.updateDetails.useMutation()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Upload image if one is selected
      if (selectedFile) {
        await handleImageUpload()
      }

      await updateUserMutation.mutateAsync(userDetails)
      setIsSuccess(true)
      setSelectedFile(null)
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    } catch (error) {
      setIsError(true)
      console.error("Failed to update user details:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImageUpload = async () => {

    if (!selectedFile) return

    setIsUploading(true)
    try {
      const session = await getSession()
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `users/${id}/${Date.now()}.${fileExt}`
      const bucket = process.env.NODE_ENV === 'development' ? 'dev_profile' : 'prod_profile'
      const authenticatedClient = createAuthenticatedClient(session?.supabaseAccessToken ?? '');
      const { error: uploadError, data } = await authenticatedClient.storage
        .from(bucket)
        .upload(fileName, selectedFile, {
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = authenticatedClient.storage
        .from(bucket)
        .getPublicUrl(fileName)

      setUserDetails(prev => ({ ...prev, image: publicUrl }))
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Click on your profile picture to change it
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer bg-transparent border-0 p-0 outline-none"
                type="button"
              >
                <Avatar className="h-32 w-32">

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    hidden
                  />
                  <AvatarImage src={userDetails.image ?? undefined} alt={userDetails.firstName} />
                  <AvatarFallback>{userDetails.firstName?.[0]}{userDetails.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </button>
            </>

            {selectedFile && (
              <div className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </div>
            )}
            {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User details</CardTitle>
            <CardDescription>
              General user settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <label htmlFor="firstName" className="block text-sm">First Name</label>
              <Input
                placeholder="First Name"
                value={userDetails.firstName}
                onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
              />
              <label htmlFor="LastName" className="block text-sm">Last Name</label>
              <Input
                placeholder="Last Name"
                className="space-y-4"
                value={userDetails.lastName}
                onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
              />
              <label htmlFor="email" className="block text-sm">Email</label>
              <Input
                placeholder="Email"
                className="space-y-4"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSave} disabled={isLoading} className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </Card>
      </div >
    </>
  )
}
