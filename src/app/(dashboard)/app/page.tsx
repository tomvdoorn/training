import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { calculateWeeklyStats, calculateTrend, formatDuration } from "~/lib/stats";
import { startOfWeek, endOfWeek, startOfWeek as startOfPreviousWeek, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, } from "lucide-react";
import CarouselItems from "@/components/app/CarouselItem";
import SportsSocialFeed from "@/components/app/social/SportsSocialFeed";
import type { User } from '@prisma/client';

// Client component for rendering stats
function StatsDisplay({
    currentStats,
    previousStats
}: {
    currentStats: ReturnType<typeof calculateWeeklyStats>;
    previousStats: ReturnType<typeof calculateWeeklyStats>;
}) {
    return (
        <div className="flex mb-4 gap-8">
            <StatCard className="flex-1 h-20 "
                title="Completed Sessions"
                value={currentStats.completedSessions}
                trend={calculateTrend(
                    currentStats.completedSessions,
                    previousStats.completedSessions
                )}
            />
            <StatCard className="flex-1 h-12"
                title="Time Spent"
                value={formatDuration(currentStats.timeSpent)}
                trend={calculateTrend(
                    currentStats.timeSpent,
                    previousStats.timeSpent
                )}
            />
            <StatCard className="flex-1 h-12"
                title="Personal Records"
                value={currentStats.personalRecords}
                trend={calculateTrend(
                    currentStats.personalRecords,
                    previousStats.personalRecords
                )}
            />
        </div>
    );
}

// Server component for data fetching
export default async function DashboardPage() {
    const session = await getServerAuthSession();
    if (!session?.user) return null;

    // Get current week's sessions
    const currentWeekStart = startOfWeek(new Date());
    const currentWeekEnd = endOfWeek(new Date());
    const currentWeekSessions = await db.trainingSession.findMany({
        where: {
            userId: session.user.id,
            startTime: {
                gte: currentWeekStart,
                lte: currentWeekEnd,
            },
        },
        include: {
            exercises: {
                include: {
                    sets: true,
                },
            },
        },
    });

    // Get previous week's sessions
    const previousWeekStart = startOfPreviousWeek(subWeeks(new Date(), 1));
    const previousWeekEnd = endOfWeek(subWeeks(new Date(), 1));
    const previousWeekSessions = await db.trainingSession.findMany({
        where: {
            userId: session.user.id,
            startTime: {
                gte: previousWeekStart,
                lte: previousWeekEnd,
            },
        },
        include: {
            exercises: {
                include: {
                    sets: true,
                },
            },
        },
    });

    // Calculate stats
    const currentStats = calculateWeeklyStats(currentWeekSessions);
    const previousStats = calculateWeeklyStats(previousWeekSessions);

    return (
        <main className="flex flex-1 flex-col gap-4 p-2 md:gap-8 md:p-8 bg-brand-dark">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold py-5 text-brand-light">Training</h1>
                <Button asChild size="sm" className="ml-auto gap-1 bg-brand-gradient-r text-gray-900 hover:opacity-90">
                    <Link href="/app/schedule">
                        View Full Schedule
                    </Link>
                </Button>
            </div>
            <div>
                <CarouselItems />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
                <div className="h-30" >
                    <Card className="xl:col-span-1 bg-gray-800 border-gray-700  ">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-brand-light">Weekly Training Overview</CardTitle>
                                <Button asChild size="sm" className="ml-auto gap-1 bg-brand-gradient-r text-gray-900 hover:opacity-90">
                                    <Link href="/app/analytics">
                                        View More
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StatsDisplay currentStats={currentStats} previousStats={previousStats} />
                        </CardContent>
                    </Card>
                </div>
                {/* Feed section - Card only shown on md and up */}
                <div className="xl:col-span-2">

                    {session?.user ? (
                        <SportsSocialFeed currentUser={session.user as User} />
                    ) : (
                        <div className="text-brand-light">Please sign in to view the feed</div>
                    )}

                    {/* Feed content shown directly on mobile */}
                    <div className="md:hidden w-full">
                        {session?.user ? (
                            <SportsSocialFeed currentUser={session.user as User} />
                        ) : (
                            <div className="text-brand-light">Please sign in to view the feed</div>
                        )}
                    </div>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-brand-light">Follow recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <div>
                            <h3 className="text-brand-skyblue">Follow these users to see their workouts in your feed</h3>
                        </div>
                        {/* TODO: Add follow recommendations here */}
                    </CardContent>
                </Card>
            </div >
        </main >
    );
}
