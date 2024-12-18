"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "~/components/ui/use-toast"

function SignInForm() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes("verify your email")) {
          // Show the first toast
          toast({
            title: "Email not verified",
            description: "Please check your email for a verification link.",
            variant: "destructive",
            duration: 4000, // Show for 4 seconds
          })

          // Option to resend verification email
          const resendResponse = await fetch("/api/auth/send-verification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              name: email.split("@")[0], // Use email username as name
            }),
          })

          if (resendResponse.ok) {
            // Show the second toast after a delay
            setTimeout(() => {
              toast({
                title: "Verification email sent",
                description: "We've sent you a new verification link.",
                duration: 4000, // Show for 4 seconds
              })
            }, 4000) // Wait for the first toast to finish
          }
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
            duration: 4000,
          })
        }
      } else {
        // Redirect to the intended page or default to /app
        const callbackUrl = searchParams.get("callbackUrl") ?? "/app"
        router.push(callbackUrl)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-sm bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-brand-light">Sign In</CardTitle>
        <CardDescription className="text-brand-skyblue">
          Enter your email and password to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-brand-light">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                autoComplete="email"
                className="bg-gray-700 border-gray-600 text-brand-light"
                tabIndex={1}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-brand-light">Password</Label>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-brand-skyblue hover:text-brand-lime-from"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-gray-700 border-gray-600 text-brand-light"
                tabIndex={2}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-brand-skyblue">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-brand-lime-from hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}