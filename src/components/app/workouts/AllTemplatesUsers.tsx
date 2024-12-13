"use client"

import { api } from "~/trpc/react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Dumbbell, MoreVertical, Play, Pencil, Pen } from "lucide-react"
import WorkoutModal from "@/components/app/workouts/AddWorkoutModal"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { useToast } from '~/components/ui/use-toast'

interface AllTemplatesUserProps {
  user_id: string;
}
export default function AllTemplatesUser({ user_id }: AllTemplatesUserProps) {
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

    <div className="container mx-auto p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Workouts</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 center"> Templates</h2>
        <WorkoutModal user_id={user_ids} />
      </div>
      {workouts && workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-1">
                <CardTitle className="grid grid-cols-8 gap-3  items-center ">
                  <Dumbbell className="mr-2 h-5 w-5 col-span-1" />
                  <div className="text-xl col-start-2 col-end-7">{template.name}</div>
                  <div className=" col-start-8 col-end-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="">
                          <MoreVertical className="w-4 h-4" />
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
              <CardContent className="flex-grow">

                <div className="text-sm text-slate-500 pb-5">

                  {template.exercises.length != 0 ? template.exercises.map((exercise, index, array) => (
                    <>
                      {exercise.exercise.name}{index < array.length - 1 ? ", " : ""}
                    </>
                  )
                  )
                    : "No exercises"}

                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <div className="grid grid-cols-3 gap-4 w-full">
                  <Button asChild variant="ghost" className="col-span-2 bg-brand-gradient-r text-gray-900 hover:opacity-90" >

                    <Link href={`/app/workouts/edit/${template.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Template
                    </Link>
                  </Button>
                  <Link href={`/app/workouts/start/${template.id}`}>
                    <Button className="bg-brand-gradient-r text-gray-900 hover:opacity-90">

                      <Play className="">

                      </Play>
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-lg text-gray-500 mb-4">No workout templates found.</p>
            <WorkoutModal user_id={user_ids} />

          </CardContent>
        </Card>
      )}
    </div>


  )
}


