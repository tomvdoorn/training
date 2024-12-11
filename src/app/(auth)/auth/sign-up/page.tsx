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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
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
                  value={data.lastName}
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
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignUpPage