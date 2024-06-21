"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import WorkoutModal  from "@/components/app/workouts/AddWorkoutModal"

export default function Component() {
  const [workouts, setWorkouts] = useState([
    {
      name: "Chest and Triceps",
      date: "June 15, 2023",
      expanded: false,
      exercises: [
        {
          name: "Bench Press",
          note: "Remember to keep your core tight.",
          sets: [
            { weight: 225, reps: 10, rpe: 7, completed: false },
            { weight: 245, reps: 8, rpe: 8, completed: false },
          ],
        },
        {
          name: "Triceps Extensions",
          note: "Focus on the contraction at the top of the movement.",
          sets: [
            { weight: 80, reps: 12, rpe: 6, completed: false },
            { weight: 90, reps: 10, rpe: 7, completed: false },
          ],
        },
      ],
    },
    {
      name: "Back and Biceps",
      date: "June 12, 2023",
      expanded: false,
      exercises: [
        {
          name: "Lat Pulldown",
          note: "Squeeze your shoulder blades together at the bottom.",
          sets: [
            { weight: 120, reps: 12, rpe: 6, completed: false },
            { weight: 130, reps: 10, rpe: 7, completed: false },
          ],
        },
        {
          name: "Bicep Curls",
          note: "Keep your elbows tucked and don't swing the weight.",
          sets: [
            { weight: 35, reps: 12, rpe: 6, completed: false },
            { weight: 40, reps: 10, rpe: 7, completed: false },
          ],
        },
      ],
    },
  ])
  const [newWeight, setNewWeight] = useState(0)
  const [newReps, setNewReps] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null)
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null)
  const [selectedSetIndex, setSelectedSetIndex] = useState(null)
  const addSet = (workoutIndex, exerciseIndex) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[workoutIndex].exercises[exerciseIndex].sets.push({
      weight: newWeight,
      reps: newReps,
      rpe: 0,
      completed: false,
    })
    setWorkouts(updatedWorkouts)
    setNewWeight(0)
    setNewReps(0)
  }
  const removeSet = (workoutIndex, exerciseIndex, setIndex) => {
    setSelectedWorkoutIndex(workoutIndex)
    setSelectedExerciseIndex(exerciseIndex)
    setSelectedSetIndex(setIndex)
    setShowDeleteConfirmation(true)
  }
  const confirmRemoveSet = () => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[selectedWorkoutIndex].exercises[selectedExerciseIndex].sets.splice(selectedSetIndex, 1)
    setWorkouts(updatedWorkouts)
    setShowDeleteConfirmation(false)
  }
  const cancelRemoveSet = () => {
    setShowDeleteConfirmation(false)
  }
  const toggleSetCompletion = (workoutIndex, exerciseIndex, setIndex) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].completed =
      !updatedWorkouts[workoutIndex].exercises[exerciseIndex].sets[setIndex].completed
    setWorkouts(updatedWorkouts)
  }
  const toggleWorkoutExpansion = (index) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[index].expanded = !updatedWorkouts[index].expanded
    setWorkouts(updatedWorkouts)
  }
  const handleAddExercise = (workoutIndex, exerciseIndex) => {
    setSelectedWorkoutIndex(workoutIndex)
    setSelectedExerciseIndex(exerciseIndex)
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
  }
  const handleSaveExercise = (newExercise) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[selectedWorkoutIndex].exercises.push(newExercise)
    setWorkouts(updatedWorkouts)
    setShowModal(false)
  }
  return (
    <>
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout Tracker</h1>
        <Button>Add Workout</Button>
      </div>
      <div className="space-y-6">
        {workouts.map((workout, workoutIndex) => (
          <Card key={workoutIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription>{workout.date}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => toggleWorkoutExpansion(workoutIndex)}>
                  {workout.expanded ? "Collapse" : "Expand"}
                </Button>
              </div>
            </CardHeader>
            {workout.expanded && (
              <CardContent>
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => addSet(workoutIndex, exerciseIndex)}>
                          Add Set
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddExercise(workoutIndex, exerciseIndex)}
                        >
                          Add Exercise
                        </Button>
                        <Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoveHorizontalIcon className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Option 1</DropdownMenuItem>
                              <DropdownMenuItem>Option 2</DropdownMenuItem>
                              <DropdownMenuItem>Option 3</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{exercise.note}</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Set</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Reps</TableHead>
                          <TableHead>Completed</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exercise.sets.map((set, setIndex) => (
                          <TableRow key={setIndex}>
                            <TableCell>{setIndex + 1}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={set.weight}
                                onChange={(e) =>
                                  handleSetUpdate(
                                    workoutIndex,
                                    exerciseIndex,
                                    setIndex,
                                    "weight",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  handleSetUpdate(
                                    workoutIndex,
                                    exerciseIndex,
                                    setIndex,
                                    "reps",
                                    parseInt(e.target.value),
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                id={`set-${workoutIndex}-${exerciseIndex}-${setIndex}`}
                                checked={set.completed}
                                onCheckedChange={() => toggleSetCompletion(workoutIndex, exerciseIndex, setIndex)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSet(workoutIndex, exerciseIndex, setIndex)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {exerciseIndex !== workout.exercises.length - 1 && (
                      <div className="border-b border-gray-200 dark:border-gray-800 my-6" />
                    )}
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <Button className="mx-auto w-full md:w-auto">Add Exercise</Button>
                </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-end" />
          </Card>
        ))}
      </div>
      {showModal && (
        <Dialog open={showModal} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <PlusIcon className="size-12 text-gray-500" />
              <p className="text-lg font-medium">Add New Exercise</p>
            </div>
            <div className="px-4 space-y-4">
              <Input placeholder="Exercise Name" />
              <Textarea placeholder="Exercise Note" />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSaveExercise({
                    name: "New Exercise",
                    note: "This is a new exercise",
                    sets: [],
                  })
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showDeleteConfirmation && (
        <Dialog open={showDeleteConfirmation} onOpenChange={cancelRemoveSet}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <TriangleAlertIcon className="size-12 text-red-500" />
              <p className="text-lg font-medium">Are you sure you want to delete this set?</p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={cancelRemoveSet}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmRemoveSet}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
          <WorkoutModal />
 </>
  )
}

function MoveHorizontalIcon(props) {
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
  )
}


function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function TriangleAlertIcon(props) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}