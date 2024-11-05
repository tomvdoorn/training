"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import AddExerciseToTemplate from "@/components/app/workouts/AddExerciseToTemplates";
import Exercise from "@/components/app/workouts/Exercises";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import { useHandleUnsavedChanges } from '~/hooks/useHandleUnsavedChanges';
import { SaveButton } from '~/components/ui/SaveButton';
import LeavingConfirmationModal from '~/components/app/workouts/LeavingConfirmationModal';
import { useRouter } from 'next/navigation';
import { useToast } from "~/components/ui/use-toast";
import type { Template, TemplateExercise, TemplateExerciseSet, Exercise as ExerciseType } from '@prisma/client';
import { Input } from "~/components/ui/input";
import { StoreListingDialog } from "@/components/app/store/StoreListingDialog"


interface PageProps {
  params: {
    id: string;
  };
}

// Add this interface
interface TemplateWithExercises extends Template {
  exercises: (TemplateExercise & {
    exercise: ExerciseType;
    sets: TemplateExerciseSet[];
  })[];
}

function WorkoutPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const templateId = parseInt(params.id);
  const { data: workout, refetch } = api.template.getTemplateById.useQuery<TemplateWithExercises>(
    { id: templateId },
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
  const {
    exercises,
    hasUnsavedChanges,
    updateTemplate,
    initializeExercises,
    resetChanges,
    addExercise,
    reorderExercises,
  } = useWorkoutTemplateStore();

  const { 
    showModal, 
    checkUnsavedChanges, 
    handleConfirmNavigation, 
    handleCancelNavigation 
  } = useHandleUnsavedChanges();

  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateNotes, setTemplateNotes] = useState('');

  useEffect(() => {
    if (workout) {
      setTemplateName(workout.name);
      setTemplateNotes(workout.note  ?? '');
    }
  }, [workout]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateNotes(e.target.value);
  };

  const handleNameBlur = async () => {
    if (workout && (templateName !== workout.name ?? templateNotes !== workout.note)) {
      try {
        await updateTemplateMutation.mutateAsync({
          id: templateId,
          name: templateName,
          note: templateNotes,
        });
        updateTemplate({ ...workout, name: templateName, note: templateNotes });
        toast({
          title: "Success",
          description: "Template updated successfully",
        });
      } catch (error) {
        console.error('Error updating template:', error);
        toast({
          title: "Error",
          description: "Failed to update template. Please try again.",
          variant: "destructive",
        });
        setTemplateName(workout.name);
        setTemplateNotes(workout.note ?? '');
      }
    }
  };

  const updateTemplateMutation = api.template.updateTemplate.useMutation();
  const updateExerciseMutation = api.template.updateExerciseInTemplate.useMutation();
  const addExerciseToTemplateMutation = api.template.addExerciseToTemplate.useMutation();
  const updateSetMutation = api.template.updateSetInTemplate.useMutation();
  const addSetToTemplateExerciseMutation = api.set.addSetToTemplateExercise.useMutation();
  const deleteSetMutation = api.set.deleteSet.useMutation();
  const deleteExerciseMutation = api.template.removeExerciseFromTemplate.useMutation();

  useEffect(() => {
    if (workout?.exercises) {
      initializeExercises(workout.exercises);
      updateTemplate(workout);
    }
  }, [workout, initializeExercises, updateTemplate]);


  const handleNavigation = (href: string) => {
    if (checkUnsavedChanges(href)) {
      router.push(href);
    }
  };

  const handleExerciseAdded = useCallback((newExercise: TemplateExercise) => {
    console.log("New exercise being added to template:", newExercise);
    addExercise(newExercise);
  }, [addExercise]);

  const handleSaveChanges = useCallback(async () => {
    console.log("handleSaveChanges triggered");
    setIsSaving(true);
    try {
      if (hasUnsavedChanges) {
        // Update template
        if (workout) {
          await updateTemplateMutation.mutateAsync({
            id: templateId,
            name: workout.name,
          });
        }

        // Handle exercises
        for (const exercise of exercises) {
          if (exercise.isNew) {
            // Add new exercise
            const newExercise = await addExerciseToTemplateMutation.mutateAsync({
              templateId,
              exerciseId: exercise.exercise!.id,
              order: exercise.order!,
            });

            // Add sets for new exercise
            if (exercise.sets) {
              for (const set of exercise.sets) {
                if (!set.deleted) {
                  await addSetToTemplateExerciseMutation.mutateAsync({
                    templateExerciseId: newExercise.id,
                  });
                }
              }
            }
          } else if (exercise.deleted) {
            // Delete existing exercise
            await deleteExerciseMutation.mutateAsync({ templateExerciseId: exercise.id! });
          } else {
            // Update existing exercise
            await updateExerciseMutation.mutateAsync({
              id: exercise.id!,
              ...exercise,
              notes: exercise.notes ?? undefined,
            });

            // Handle sets for existing exercise
            if (exercise.sets) {
              for (const set of exercise.sets) {
                if (set.isNew && !set.deleted) {
                  await addSetToTemplateExerciseMutation.mutateAsync({
                    templateExerciseId: exercise.id!,
                  });
                } else if (!set.isNew && set.deleted) {
                  await deleteSetMutation.mutateAsync({ setId: set.id! });
                } else if (!set.isNew && !set.deleted) {
                  await updateSetMutation.mutateAsync({
                    id: set.id!,
                    reps: set.reps!,
                    weight: set.weight!,
                    type: set.type!,
                  });
                }
              }
            }
          }
        }
        await refetch();
        resetChanges();
        toast({
          title: "Success",
          description: "Changes saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [exercises, hasUnsavedChanges, templateId, workout, updateTemplateMutation, updateExerciseMutation, addExerciseToTemplateMutation, updateSetMutation, addSetToTemplateExerciseMutation, deleteSetMutation, deleteExerciseMutation, refetch, resetChanges, toast]);

  const handleReorderExercises = useCallback((fromIndex: number, toIndex: number) => {
    reorderExercises(fromIndex, toIndex);
  }, [reorderExercises]);

  // Add this query to get store listing if it exists
  const { data: storeListing } = api.store.getListingByTemplateId.useQuery({
    template_id: templateId,
  })

  return (
    <div className="flex flex-col md:flex-row justify-center min-h-screen p-4 md:gap-4">
      <div className="flex-1 w-full pb-16 md:pb-0">
        <div className="mb-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push('/app/workouts')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {/* Add Store Listing button if template is not a copy */}
          {workout && !workout.is_copy && (
            <StoreListingDialog
              type="Template"
              itemId={templateId}
              existingListing={storeListing}
            />
          )}
        </div>
        <div className="md:hidden mb-4">
          <div className="inline-flex items-center gap-2 group w-full">
            <Input
              value={templateName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              className="text-2xl font-semibold p-0 border-none focus:ring-0 focus-visible:ring-0 bg-transparent group-hover:bg-gray-100 rounded transition-colors duration-200"
            />
            <Pencil className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Edit your workout template</p>
        </div>
        <div className="md:hidden">
          {exercises.filter(ex => !ex.deleted).map((exercise, index) => (
            <Exercise 
              key={exercise.id}
              templateExerciseId={exercise.id!}
              template_id={workout?.id}
              exerciseIndex={index}
              exercise={exercise.exercise!}
              sets={exercise.sets as TemplateExerciseSet[]}
              workoutIndex={index}
              start={false}
              onReorder={handleReorderExercises}
              templateExercise={{
                id: exercise.id,
                notes: exercise.notes,
                deleted: exercise.deleted,
                sets: exercise.sets as TemplateExerciseSet[],
                is_copy: workout?.is_copy
              }}
            />
          ))}
        </div>
        <Card className="w-full hidden md:block">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-full max-w-md">
                <div className="inline-flex items-center gap-2 group">
                  <Input
                    value={templateName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    className="text-2xl font-semibold p-0 border-none focus:ring-0 focus-visible:ring-0 bg-transparent group-hover:bg-gray-100 rounded transition-colors duration-200"
                  />
                  <Pencil className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </div>
                <CardDescription className='mt-2'>Edit your workout template</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={templateNotes}
              onChange={handleNotesChange}
              onBlur={handleNameBlur}
              placeholder="Add a note for this template..."
              className="w-full p-2 mb-4 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={templateNotes ? undefined : 3}
            />
            {exercises.filter(ex => !ex.deleted).map((exercise, index) => (
              <Exercise 
                key={exercise.id}
                templateExerciseId={exercise.id!}
                template_id={workout?.id}
                exerciseIndex={index}
                exercise={exercise.exercise!}
                sets={exercise.sets as TemplateExerciseSet[]}
                workoutIndex={index}
                start={false}
                onReorder={handleReorderExercises}
                templateExercise={{
                  id: exercise.id,
                  notes: exercise.notes,
                  deleted: exercise.deleted,
                  sets: exercise.sets as TemplateExerciseSet[],
                  is_copy: workout?.is_copy
                }}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <SaveButton onSave={handleSaveChanges} isLoading={isSaving} />
          </CardFooter>
        </Card>
      </div>
      <div className="hidden md:block w-1/3">
        <Card className="h-[calc(100vh-2rem)] flex flex-col">
          <CardContent className="py-4">
            <AddExerciseToTemplate 
              templateId={templateId}
              onExerciseAdded={handleExerciseAdded}
              isModal={false}
            />
          </CardContent>
        </Card>
      </div>
      <div className="md:hidden fixed bottom-4 left-4 right-4 flex justify-between items-center">
        <AddExerciseToTemplate 
          templateId={templateId} 
          onExerciseAdded={handleExerciseAdded}
        />
        <SaveButton onSave={handleSaveChanges} isLoading={isSaving} />
      </div>
      <LeavingConfirmationModal 
        isOpen={showModal} 
        onClose={handleCancelNavigation} 
        onConfirm={() => {
          handleSaveChanges().then(() => {
            handleConfirmNavigation();
          }).catch((error) => {
            console.error('Error during save and navigation:', error);
          });
        }} 
      />
    </div>
  );
}
export default WorkoutPage;
