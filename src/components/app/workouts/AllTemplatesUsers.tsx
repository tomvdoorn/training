"use client"

import { api } from "~/trpc/react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Dumbbell } from "lucide-react"
import WorkoutModal from "@/components/app/workouts/AddWorkoutModal"

interface AllTemplatesUserProps {
  user_id: string;
}
export default function AllTemplatesUser({ user_id }:AllTemplatesUserProps) {
  const user_ids = user_id
  const { data: workouts, error, refetch } = api.template.getTemplatesUser.useQuery(
  )

  if (error) {
    return <div>Error loading workouts: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Workout Templates</h1>
        <WorkoutModal user_id={user_ids} />
      </div>
      
      {workouts && workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  <div className="text-xl">{template.name}</div>
                  
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-500">
                  {template.exercises.map((exercise, index, array) =>(
                    <>
                 {exercise.exercise.name}{index < array.length - 1 ? ", " : ""} 
                </>
                  )
                  )}
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/app/workouts/edit/${template.id}`}>
                    Edit Template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-lg text-gray-500 mb-4">No workout templates found.</p>
            <Button asChild>
              <Link href="/app/workouts/new">Create Your First Template</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}