"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutDistribution } from "./components/WorkoutDistribution"
import { MuscleGroupChart } from "./components/MuscleGroupChart"
import { WeeklyVolume } from "./components/WeeklyVolume"
import { PersonalRecords } from "./components/PersonalRecords"
import { api } from "~/trpc/react"
import { startOfMonth } from "date-fns"
import { type AnalyticsStats } from "~/types/analytics"

export default function AnalyticsPage() {
  const { data: stats, isLoading } = api.analytics.getStats.useQuery<AnalyticsStats>()

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  // Calculate consistency
  const consistency = stats ? Math.round((stats.workoutsThisWeek / 7) * 100) : 0

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalWorkouts}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.workoutsThisWeek} this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Weight Lifted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalWeight}kg</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Personal Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPRs ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.prsThisMonth ?? 0} this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Workout Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{consistency}%</div>
                <p className="text-xs text-muted-foreground">
                  Of planned workouts completed
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Volume</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <WeeklyVolume data={stats?.weeklyVolume} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Muscle Groups</CardTitle>
                <CardDescription>
                  Distribution of trained muscle groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MuscleGroupChart data={stats?.muscleGroups} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Workout Distribution</CardTitle>
                <CardDescription>
                  Your workout frequency by day of week
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <WorkoutDistribution data={stats?.workoutsByDay} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent PRs</CardTitle>
                <CardDescription>
                  Your latest personal records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalRecords data={stats?.recentPRs} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}