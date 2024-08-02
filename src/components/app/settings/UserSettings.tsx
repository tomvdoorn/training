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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { api } from "~/trpc/react"  

interface User {
  id: string,
  firstName: string,
  lastName: string,
  email?: string,
}

export default function UserSettings({ id, firstName, lastName, email }: User) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userDetails, setUserDetails] = useState<User>({
    id,
    firstName,
    lastName,
    email,
  })

  useEffect(() => {
    setUserDetails({
      id,
      firstName,
      lastName,
      email,
    })
  }, [id, firstName, lastName, email])

  const updateUserMutation = api.user.updateDetails.useMutation()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateUserMutation.mutateAsync(userDetails)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
      console.error("Failed to update user details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
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
                      onChange={(e) => setUserDetails({...userDetails, firstName: e.target.value})}

                    />
                    <label htmlFor="LastName" className="block text-sm">Last Name</label>
                    <Input 
                      placeholder="Last Name" 
                      className="space-y-4" 
                      value={userDetails.lastName}
                      onChange={(e) => setUserDetails({...userDetails, lastName: e.target.value})}
                    />
                <label htmlFor="email" className="block text-sm">Email</label>
                    <Input 
                      placeholder="Email" 
                      className="space-y-4" 
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    />
                  </form>
                </CardContent>
              <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Plugins Directory</CardTitle>
                <CardDescription>
                  The directory within your project, in which your plugins are
                  located.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <Input
                    placeholder="Project Name"
                    defaultValue="/content/plugins"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include" defaultChecked />
                    <label
                      htmlFor="include"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow administrators to change the directory.
                    </label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">

            <Button type="button" onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>              </CardFooter>
            </Card>
          </div>
    </>
  )
}
