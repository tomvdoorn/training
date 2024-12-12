"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutDistribution } from "./components/WorkoutDistribution"
import { MuscleGroupChart } from "./components/MuscleGroupChart"
import { WeeklyVolume } from "./components/WeeklyVolume"
import { PersonalRecords } from "./components/PersonalRecords"
import { api } from "~/trpc/react"
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
        <h2 className="text-3xl font-bold tracking-tight text-brand-light">Analytics</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="text-brand-light data-[state=active]:bg-brand-gradient-r data-[state=active]:text-gray-900">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-brand-light data-[state=active]:bg-brand-gradient-r data-[state=active]:text-gray-900">Detailed Analytics</TabsTrigger>
          <TabsTrigger value="progress" className="text-brand-light data-[state=active]:bg-brand-gradient-r data-[state=active]:text-gray-900">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-light">
                  Total Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-light">{stats?.totalWorkouts}</div>
                <p className="text-xs text-brand-skyblue">
                  +{stats?.workoutsThisWeek} this week
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-light">
                  Total Weight Lifted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-light">{stats?.totalWeight}kg</div>
                <p className="text-xs text-brand-skyblue">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-light">Personal Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-light">{stats?.totalPRs ?? 0}</div>
                <p className="text-xs text-brand-skyblue">
                  +{stats?.prsThisMonth ?? 0} this month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-light">
                  Workout Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-light">{consistency}%</div>
                <p className="text-xs text-brand-skyblue">
                  Of planned workouts completed
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-brand-light">Weekly Volume</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <WeeklyVolume data={stats?.weeklyVolume} />
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-brand-light">Muscle Groups</CardTitle>
                <CardDescription className="text-brand-skyblue">
                  Distribution of trained muscle groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MuscleGroupChart data={stats?.muscleGroups} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-brand-light">Workout Distribution</CardTitle>
                <CardDescription className="text-brand-skyblue">
                  Your workout frequency by day of week
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <WorkoutDistribution data={stats?.workoutsByDay} />
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-brand-light">Recent PRs</CardTitle>
                <CardDescription className="text-brand-skyblue">
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