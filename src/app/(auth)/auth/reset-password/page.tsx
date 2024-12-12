"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "~/components/ui/use-toast";

interface ErrorResponse {
    error: string;
    code?: string;
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast({
                    title: "Reset email sent",
                    description: "Check your email for a link to reset your password.",
                    duration: 5000,
                });
                router.push("/auth/sign-in");
            } else {
                const data = await response.json() as ErrorResponse;
                toast({
                    title: "Error",
                    description: data.error ?? "Failed to send reset email",
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mx-auto max-w-sm bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-brand-light">Reset Password</CardTitle>
                <CardDescription className="text-brand-skyblue">
                    Enter your email address and we&apos;ll send you a link to reset your password
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
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/auth/sign-in")}
                            className="bg-gray-700 text-brand-light hover:text-brand-lime-from border-gray-600"
                        >
                            Back to Sign In
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 