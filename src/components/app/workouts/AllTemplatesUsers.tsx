"use client"

import { api } from "~/trpc/react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Dumbbell } from "lucide-react"
import WorkoutModal from "@/components/app/workouts/AddWorkoutModal"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { useToast } from '~/components/ui/use-toast'

interface AllTemplatesUserProps {
  user_id: string;
}
export default function AllTemplatesUser({ user_id }:AllTemplatesUserProps) {
    const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const user_ids = user_id
  const { data: workouts, error, refetch } = api.template.getTemplatesUser.useQuery(
  )



const deleteTemplateMutation = api.template.deleteTemplate.useMutation({
    onSuccess: () => {
      void refetch()
      toast({
        title: "Template deleted",
        description: "Your workout template has been successfully deleted.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete template: ${error.message}`,
        variant: "destructive",
      })
    },
  })
  const handleDeleteTemplate = useCallback((id: number) => {
    if (isDeleting) return
    setIsDeleting(true)
    deleteTemplateMutation.mutate({ id }, {
      onSettled: () => setIsDeleting(false)
    })
  }, [deleteTemplateMutation, isDeleting])
  
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
                  <div className="items-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <MoveHorizontalIcon className="w-4 h-4" />
                  </Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>

                    Delete Template</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
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

function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}