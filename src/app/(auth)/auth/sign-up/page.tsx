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
import { useToast } from "~/components/ui/use-toast";

interface signUpProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [data, setData] = useState<signUpProps>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const { mutate: signUp } = api.auth.signUp.useMutation({
    onSuccess: async (user) => {
      try {
        // Send verification email
        await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: `${data.firstName} ${data.lastName}`,
          }),
        });

        toast({
          title: "Sign-up successful",
          description: "Please check your email to verify your account",
          variant: "default"
        });
        router.push("/auth/sign-in");
      } catch (error) {
        console.error("Error sending verification email:", error);
        toast({
          title: "Warning",
          description: "Account created but verification email could not be sent",
          variant: "destructive"
        });
      }
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

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      signUp(data);
    } catch (error) {
      // Handle sign-up error
    }
  };

  return (
    <Card className="mx-auto max-w-sm bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-brand-light">Sign Up</CardTitle>
        <CardDescription className="text-brand-skyblue">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name" className="text-brand-light">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  value={data.firstName}
                  onChange={(e) => setData({ ...data, firstName: e.target.value })}
                  required
                  className="bg-gray-700 border-gray-600 text-brand-light"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name" className="text-brand-light">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  value={data.lastName}
                  onChange={(e) => setData({ ...data, lastName: e.target.value })}
                  required
                  className="bg-gray-700 border-gray-600 text-brand-light"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-brand-light">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="bg-gray-700 border-gray-600 text-brand-light"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-brand-light">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                className="bg-gray-700 border-gray-600 text-brand-light"
              />
            </div>
            <Button type="submit" className="w-full bg-brand-gradient-r text-gray-900 hover:opacity-90">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-brand-skyblue">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-brand-lime-from hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignUpPage