import React from 'react';
import CarouselItems from "@/components/app/CarouselItem"; // Ensure the path is correct
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import SportsSocialFeed from "@/components/app/social/SportsSocialFeed";
import { getCurrentUser } from "@/lib/session"
import type { User } from '@prisma/client';


const Dashboard = async () => {
      const currentUser = await getCurrentUser()
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold py-5">Training</h1>
                <Button asChild variant="outline" size="sm">
                    <Link href="/app/schedule">
                        View Full Schedule
                    </Link>
                </Button>
            </div>
            <div>
                <CarouselItems />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
                <Card className="xl:col-span-1">
                    <CardHeader>
                        <CardTitle>Stats about previous sessions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {/* Add recent sales content here */}
                    </CardContent>
                </Card>
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Feed</CardTitle>
                            <CardDescription>
                                Recent workouts completed by the community.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="#">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {currentUser ? (
                            <SportsSocialFeed currentUser={currentUser as User} />
                        ) : (
                            <div>Please sign in to view the feed</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Follow recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <div>
                            <h3>Follow these users to see their workouts in your feed</h3>
                        </div>
                        {/* TODO: Add follow recommendations here */}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default Dashboard;
