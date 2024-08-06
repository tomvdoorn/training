"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import AddExerciseToTemplate from "@/components/app/workouts/AddExerciseToTemplates";
import Exercise from "@/components/app/workouts/Exercises";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import { useHandleUnsavedChanges } from '~/hooks/useHandleUnsavedChanges';
import { SaveButton } from '~/components/ui/SaveButton';
import LeavingConfirmationModal from '~/components/app/workouts/LeavingConfirmationModal';
import { useRouter } from 'next/navigation';
import { useToast } from "~/components/ui/use-toast";
import type { TemplateExercise } from '@prisma/client';

interface PageProps {
  params: {
    id: string;
  };
}

function WorkoutPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const templateId = parseInt(params.id);
  const { data: workout, refetch } = api.template.getTemplateById.useQuery(
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
  } = useWorkoutTemplateStore();

  const { 
    showModal, 
    checkUnsavedChanges, 
    handleConfirmNavigation, 
    handleCancelNavigation 
  } = useHandleUnsavedChanges();

  const [isSaving, setIsSaving] = useState(false);

  const updateTemplateMutation = api.template.updateTemplate.useMutation();
  const updateExerciseMutation = api.template.updateExerciseInTemplate.useMutation();
  const addExerciseToTemplateMutation = api.template.addExerciseToTemplate.useMutation();
  const updateSetMutation = api.template.updateSetInTemplate.useMutation();
  const addSetToTemplateExerciseMutation = api.set.addSetToTemplateExercise.useMutation();
  const deleteSetMutation = api.set.deleteSet.useMutation();
  const deleteExerciseMutation = api.template.removeExerciseFromTemplate.useMutation();

  useEffect(() => {
    if (workout && workout.exercises) {
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

return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-11/12 max-w-6xl p-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => handleNavigation("/app/workouts/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{workout?.name}</CardTitle>
                <CardDescription className='mt-2'>Edit your workout template</CardDescription>
              </div>
              <AddExerciseToTemplate 
                templateId={templateId} 
                onExerciseAdded={handleExerciseAdded}
              />            
            </div>
          </CardHeader>
          <CardContent>
            {exercises.filter(ex => !ex.deleted).map((exercise, index) => (
              <Exercise 
                key={exercise.id ?? `new-${index}`}
                templateExerciseId={exercise.id!}
                template_id={workout?.id}
                exerciseIndex={index}
                exercise={exercise.exercise!}
                sets={exercise.sets ?? undefined}
                workoutIndex={index}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <SaveButton onSave={handleSaveChanges} isLoading={isSaving} />
          </CardFooter>
        </Card>
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