"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function NewPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            toast({
                title: "Invalid link",
                description: "The password reset link is invalid or has expired.",
                variant: "destructive",
            });
            router.push("/auth/sign-in");
            return;
        }

        // Validate token
        const validateToken = async () => {
            try {
                const response = await fetch("/api/auth/validate-reset-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    toast({
                        title: "Invalid link",
                        description: "The password reset link is invalid or has expired.",
                        variant: "destructive",
                    });
                    router.push("/auth/sign-in");
                    return;
                }

                setIsValidToken(true);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred",
                    variant: "destructive",
                });
                router.push("/auth/sign-in");
            }
        };

        void validateToken();
    }, [router, searchParams, toast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters long",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: searchParams.get("token"),
                    password,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Your password has been reset successfully. Please sign in with your new password.",
                    duration: 5000,
                });
                router.push("/auth/sign-in");
            } else {
                const data = await response.json() as ErrorResponse;
                toast({
                    title: "Error",
                    description: data.error ?? "Failed to reset password",
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

    if (!isValidToken) {
        return null;
    }

    return (
        <Card className="mx-auto max-w-sm bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-brand-light">Reset Password</CardTitle>
                <CardDescription className="text-brand-skyblue">
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-brand-light">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                className="bg-gray-700 border-gray-600 text-brand-light"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword" className="text-brand-light">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="Confirm your new password"
                                autoComplete="new-password"
                                className="bg-gray-700 border-gray-600 text-brand-light"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
                            {isLoading ? "Resetting..." : "Reset Password"}
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

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPasswordForm />
        </Suspense>
    );
} 