/* eslint-disable */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type VerificationStatus = "loading" | "success" | "error" | "invalid" | "expired";

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<VerificationStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("invalid");
            setErrorMessage("No verification token found in the URL.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch("/api/auth/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    // Auto sign-in and redirect to app
                    const email = searchParams.get("email");
                    if (email) {
                        router.push(`/auth/sign-in?email=${encodeURIComponent(email)}`);
                        return;
                    }
                    // If no email provided, just redirect to sign-in
                    router.push("/auth/sign-in");
                } else {
                    setStatus(data.code === "TOKEN_EXPIRED" ? "expired" : "error");
                    setErrorMessage(data.error || "Failed to verify email.");
                }
            } catch (error) {
                setStatus("error");
                setErrorMessage("An unexpected error occurred.");
            }
        };

        void verifyEmail();
    }, [router, searchParams]);

    const handleTryAgain = () => {
        router.push("/auth/sign-up");
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle>Email Verification</CardTitle>
            </CardHeader>
            <CardContent>
                {status === "loading" && (
                    <p className="text-gray-600">Verifying your email...</p>
                )}
                {status === "success" && (
                    <div>
                        <p className="text-green-600">Email verified successfully!</p>
                        <p className="text-sm text-gray-500">
                            Redirecting you to sign in...
                        </p>
                    </div>
                )}
                {(status === "error" || status === "invalid" || status === "expired") && (
                    <div className="space-y-4">
                        <p className="text-red-600">
                            {status === "expired"
                                ? "This verification link has expired."
                                : status === "invalid"
                                    ? "Invalid verification link."
                                    : errorMessage}
                        </p>
                        <p className="text-sm text-gray-500">
                            {status === "expired"
                                ? "Please request a new verification link."
                                : "Please try signing up again or contact support."}
                        </p>
                        <Button onClick={handleTryAgain} className="w-full">
                            Try Again
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyForm />
        </Suspense>
    );
} 