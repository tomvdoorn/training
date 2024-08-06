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

const Dashboard = () => {
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
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Workouts</CardTitle>
                            <CardDescription>
                                Recent workouts completed.
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
                        {/* Add workout content here */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {/* Add recent sales content here */}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default Dashboard;