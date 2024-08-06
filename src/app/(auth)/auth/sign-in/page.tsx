"use client"

import { Suspense } from "react"
import Link from "next/link"
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
import { signIn } from "next-auth/react"
import { useState, FormEvent } from "react"
import { useToast } from "~/components/ui/use-toast"

interface SignInProps {
  email: string;
  password: string;
}

const LoginFormContent = () => {
  const { toast } = useToast();
  const [data, setData] = useState<SignInProps>({
    email: "",
    password: "",
  })

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/app",
    });

    if (result?.error) {
      toast({
        title: "Login failed",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive"
      });
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input 
              id="password" 
              onChange={(e) => setData({ ...data, password: e.target.value })}
              type="password" 
              required 
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Login with Google
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={() => signIn("discord", {callbackUrl: "/app"})}
          >
            Login with Discord
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

const LoginForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  )
}

export default LoginForm