"use client"
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
import { useState } from "react"
import { toast } from "sonner"


interface signInProps {
  email: string;
  password: string;
}

const LoginForm = () => {

    const [data, setData] = useState<signInProps>({
    email: "",
    password: "",
  })
  const handleLogin = async (data:signInProps) => {
    console.log(data.email)
    console.log(data.password)
  const result = await signIn("credentials", {
    email: data.email,
    password: data.password,
    callbackUrl: "/app",
    
  });

  if (result?.error) {
    toast.error("Invalid email or password");
    console.error(result.error);
  } else {
    // Redirect or update UI
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
        <div className="grid gap-4">
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
            <Input id="password" 
            onChange={(e) => setData({ ...data, password: e.target.value })}
            type="password" required />
          </div>
          <Button type="submit" className="w-full" onClick={() => handleLogin(data)}>
            Login
          </Button>
          <Button variant="outline" className="w-full" >
            Login with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => signIn("discord", {callbackUrl: "/app"}  )}>
            Login with Discord
          </Button>
        </div>
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


export default LoginForm