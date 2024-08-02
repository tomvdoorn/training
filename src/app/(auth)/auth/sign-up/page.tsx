"use client";
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
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react";
import { useState } from "react";
import { useToast} from "~/components/ui/use-toast";

interface signUpProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter()
  const {toast } = useToast()
  const [data, setData] = useState<signUpProps>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const { mutate: signUp } = api.auth.signUp.useMutation({
  onSuccess: () => {
    router.push("/auth/sign-in");
  },
  onError: (error) => {
    const message = error.message
    toast({
      title: "Sign-up error",
      description: message,
      variant: "destructive"
    })
    console.error("Sign-up error:", error);
  },
});

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
       signUp(data);
      // Handle successful sign-up
    } catch (error) {

      // Handle sign-up error
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input 
              id="last-name" 
              placeholder="Robinson" 
              value= {data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value= {data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" 
            value = {data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSignUp}
          >
            Create an account
          </Button>
          {/* <Button variant="outline" className="w-full">
            Sign up with Google
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignUpPage