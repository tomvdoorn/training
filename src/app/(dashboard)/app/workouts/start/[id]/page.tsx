"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import AddExerciseToTemplate from "@/components/app/workouts/AddExerciseToTemplates";
import Exercise from "@/components/app/workouts/Exercises";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LeavingConfirmationModal from '~/components/app/workouts/LeavingConfirmationModal';
import { useRouter } from 'next/navigation';
import { useToast } from "~/components/ui/use-toast";
import type { TemplateExercise, TemplateExerciseSet } from '@prisma/client';
import { useSessionHandler } from '~/hooks/useSessionHandler';
import { FinishWorkoutModal } from '~/components/app/workouts/FinishWorkoutModal';
import SetDataSelector from '~/components/app/workouts/SetDataSelector';
import type { Media } from '@prisma/client';

interface PageProps {
  params: {
    id: string;
  };
}

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  exerciseId: number;
  setIds: number[];
}

interface PartialTemplateExercise extends Partial<TemplateExercise> {
  pendingMedia?: Array<{
    file: string;
    fileType: string;
    setIndices: number[];
  }>;
  sets?: (TemplateExerciseSet & { completed?: boolean, deleted?: boolean })[]
  exercise?: (typeof Exercise & { id?: number })
  deleted?: boolean;
}

function StartWorkout({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const templateId = parseInt(params.id);
  const [sessionId, setSessionId] = useState<number | null>(null);
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
    showModal,
    checkUnsavedChanges,
    handleConfirmNavigation,
    handleCancelNavigation,
    handleSetCompletion,
    addExercise,
    updateTemplate,
    initializeExercises,
    resetChanges,
    reorderExercises,
    generalMedia,
  } = useSessionHandler();

  const handleReorderExercises = useCallback((fromIndex: number, toIndex: number) => {
    reorderExercises(fromIndex, toIndex);
  }, [reorderExercises]);

  const [isSaving, setIsSaving] = useState(false);

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const now = new Date();
    setStartTime(now);
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const createTrainingSessionMutation = api.session.createTrainingSession.useMutation();
  const createPostMutation = api.post.createPost.useMutation();
  const createSessionExerciseMutation = api.session.createSessionExercise.useMutation();
  const createSessionSetsMutation = api.session.createSessionSets.useMutation();
  const uploadSessionExerciseMediaMutation = api.media.create.useMutation();
  const updatePostMutation = api.post.updatePost.useMutation();
  const checkAndCreatePRsMutation = api.exercise.checkAndCreatePRs.useMutation();
  const [availableMedia, setAvailableMedia] = useState<MediaItem[]>([]);
  const exerciseMediaQuery = api.media.getBySessionExercise.useQuery(
    { sessionExerciseId: sessionId ?? -1 },
    { enabled: !!sessionId }
  );

  useEffect(() => {
    if (exerciseMediaQuery.data) {
      setAvailableMedia(exerciseMediaQuery.data.map((item: Media) => ({
        id: String(item.id),
        url: item.fileUrl,
        type: item.fileType as 'image' | 'video',
        exerciseId: item.sessionExerciseId ?? 0,
        setIds: Array.isArray(item.sessionExerciseSetId) ? item.sessionExerciseSetId : [item.sessionExerciseSetId ?? -1]
      })));
      console.log('Initial availableMedia:', availableMedia);

    }
  }, [exerciseMediaQuery.data]);

  useEffect(() => {
    if (workout && workout.exercises) {
      const initialExercises = workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets?.map(set => ({
          ...set,
          //   weight: undefined,
          //   reps: undefined
        })
          // 
        )
        //  ?? []
      }));
      initializeExercises(initialExercises);
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

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const handleSaveChanges = useCallback(async (data: {
    privacy: 'public' | 'followers' | 'private';
    note: string;
    title: string;
    rating: number;
    endTime: Date;
    selectedMedia: string[];
  }) => {
    setIsSaving(true);
    try {
      if (hasUnsavedChanges) {
        const newTrainingSession = await createTrainingSessionMutation.mutateAsync({
          templateId: templateId,
          startTime: startTime!,
          endTime: data.endTime,
          completed: true,
          rating: data.rating,
        });

        const newPost = await createPostMutation.mutateAsync({
          trainingSessionId: newTrainingSession.id,
          templateId: templateId,
          privacy: data.privacy,
          note: data.note,
          title: data.title,
          mediaIds: [],
        });

        let totalPRs = 0;
        let totalWeight = 0;
        const newMediaIds: number[] = [];
        const completedSets: Array<{
          exerciseId: number;
          sessionExerciseId: number;
          setId: number;
          reps: number;
          weight: number;
        }> = [];

        for (const exercise of exercises as PartialTemplateExercise[]) {
          if (exercise.deleted) {
            console.log("Skipping deleted exercise:", exercise);
            continue;
          }

          console.log("Processing exercise:", exercise);
          console.log("exercise.id", exercise.id);

          const exerciseId = exercise.exercise?.id;
          if (!exerciseId) {
            console.error('Missing exercise ID');
            continue;
          }

          const newSessionExercise = await createSessionExerciseMutation.mutateAsync({
            sessionId: newTrainingSession.id,
            exerciseId: exerciseId,
            order: exercise.order!,
            ...(exercise.id && { templateExerciseId: exercise.id }),
          });

          if (exercise.sets) {
            console.log(`Processing ${exercise.sets.length} sets for exercise ${exercise.id}`);
            const validSets = exercise.sets.filter(set => !set.deleted);

            if (validSets.length > 0) {
              const newSessionSets = await createSessionSetsMutation.mutateAsync(
                validSets.map(set => ({
                  sessionExerciseId: newSessionExercise.id,
                  reps: set.reps ?? 0,
                  weight: set.weight ?? 0,
                  type: set.type ?? 'Regular',
                  completed: set.completed ?? false,
                }))
              );

              // Track completed sets for PR checking
              validSets.forEach((set, index) => {
                if (set.completed && set.weight && set.reps) {
                  totalWeight += (set.weight * set.reps);
                  completedSets.push({
                    exerciseId: exerciseId,
                    sessionExerciseId: newSessionExercise.id,
                    setId: index + 1, // Assuming the sets are created in order
                    reps: set.reps,
                    weight: set.weight,
                  });
                }
              });
            }
          }

          if (exercise.pendingMedia?.length) {
            for (const media of exercise.pendingMedia) {
              if (data.selectedMedia.includes(media.file)) {
                const newMedia = await uploadSessionExerciseMediaMutation.mutateAsync({
                  sessionExerciseId: newSessionExercise.id,
                  fileUrl: media.file,
                  fileType: media.fileType,
                  setIds: media.setIndices.map(index => exercise?.sets?.[index]?.id).filter(Boolean) as number[],
                  postId: newPost.id,
                });
                newMediaIds.push(newMedia.id);
              }
            }
          }
        }

        // Check PRs in batch
        if (completedSets.length > 0) {
          const prResults = await checkAndCreatePRsMutation.mutateAsync(completedSets);
          totalPRs = prResults.newPRsCount;
        }

        if (generalMedia.length) {
          for (const media of generalMedia) {
            if (data.selectedMedia.includes(media.file)) {
              const newMedia = await uploadSessionExerciseMediaMutation.mutateAsync({
                fileUrl: media.file,
                fileType: media.fileType,
                setIds: [],
                postId: newPost.id,
              });
              newMediaIds.push(newMedia.id);
            }
          }
        }

        await updatePostMutation.mutateAsync({
          id: newPost.id,
          numberOfPRs: totalPRs,
          totalWeightLifted: totalWeight,
          mediaIds: newMediaIds,
        });

        console.log("Post updated with PR information");

        await refetch();
        resetChanges();
        toast({
          title: "Success",
          description: `Workout finished and post created successfully. You set ${totalPRs} new personal records!`,
        });
        router.push("/app/workouts/");
      }
    } catch (error) {
      console.error('Error finishing workout:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast({
        title: "Error",
        description: "Failed to finish workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsFinishModalOpen(false);
    }
  }, [
    hasUnsavedChanges,
    exercises,
    templateId,
    startTime,
    createTrainingSessionMutation,
    createPostMutation,
    createSessionExerciseMutation,
    createSessionSetsMutation,
    checkAndCreatePRsMutation,
    updatePostMutation,
    refetch,
    resetChanges,
    toast,
    router,
    generalMedia
  ]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const [setDataOption, setSetDataOption] = useState<'lastSession' | 'prSession' | 'template'>('lastSession');

  const lastSessionQuery = api.session.getLastSessionData.useQuery({ templateId }, {
    select: (data) => data ? {
      exercises: data.exercises.map(ex => ({
        id: ex.id,
        templateExerciseId: ex.templateExerciseId,
        sets: ex.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          type: set.type
        }))
      }))
    } : undefined
  });
  const prSessionQuery = api.session.getPRSessionData.useQuery({ templateId }, {
    select: (data) => data ? Object.entries(data).map(([id, exercise]) => ({
      id: parseInt(id),
      sets: exercise.sets
    })) : undefined
  });

  return (

    <div className="flex flex-col md:flex-row justify-center min-h-screen">
      <div className="flex-1 w-full md:p-6 pb-20 md:pb-6 overflow-x-hidden">
        <div className="mb-4 md:mb-6 px-4 md:px-0">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/app/workouts/")}
            className="md:static fixed top-4 left-4 z-10 bg-background"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="md:hidden mb-4 px-4">
          <h2 className="text-2xl font-bold">{workout?.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Edit your workout template</p>
          <div className="text-lg font-semibold mt-2">
            Elapsed Time: {formatElapsedTime(elapsedTime)}
          </div>
        </div>
        <div className="hidden md:block">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{workout?.name}</CardTitle>
                  <CardDescription className='mt-2'>Edit your workout template</CardDescription>
                  <div className="text-lg font-semibold">
                    Elapsed Time: {formatElapsedTime(elapsedTime)}
                  </div>
                </div>
                <AddExerciseToTemplate
                  templateId={templateId}
                  onExerciseAdded={handleExerciseAdded}
                />
              </div>
            </CardHeader>
            <CardContent>
              <SetDataSelector value={setDataOption} onChange={setSetDataOption} />
              {workout?.note && (
                <div className="mt-4">
                  <label className="text-sm font-semibold mb-2">Notes</label>
                  <textarea
                    value={workout?.note}
                    className="w-full p-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
              )}
              {exercises.filter(ex => !ex.deleted).map((exercise, index) => (
                <Exercise
                  key={exercise.id ?? `new-${index}`}
                  templateExerciseId={exercise.id!}
                  template_id={workout?.id}
                  exerciseIndex={index}
                  exercise={exercise.exercise!}
                  sets={exercise.sets as TemplateExerciseSet[]}
                  workoutIndex={index}
                  onReorder={handleReorderExercises}
                  start
                  setDataOption={setDataOption}
                  lastSessionData={lastSessionQuery.data}
                  prSessionData={prSessionQuery.data ?? undefined}
                  templateExercise={exercise as Partial<TemplateExercise>}
                />
              ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setIsFinishModalOpen(true)} disabled={isSaving}>
                Finish Workout
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="md:hidden px-4">
          <SetDataSelector value={setDataOption} onChange={setSetDataOption} />
          {exercises.filter(ex => !ex.deleted).map((exercise, index) => (
            <Exercise
              key={exercise.id ?? `new-${index}`}
              templateExerciseId={exercise.id!}
              template_id={workout?.id}
              exerciseIndex={index}
              exercise={exercise.exercise!}
              sets={exercise.sets as TemplateExerciseSet[]}
              workoutIndex={index}
              start
              onReorder={handleReorderExercises}
              setDataOption={setDataOption}
              lastSessionData={lastSessionQuery.data ?? undefined}
              prSessionData={prSessionQuery.data ?? undefined}
            />
          ))}
        </div>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-4 flex justify-between items-center">
        <AddExerciseToTemplate
          templateId={templateId}
          onExerciseAdded={handleExerciseAdded}
        />
        <Button onClick={() => setIsFinishModalOpen(true)} disabled={isSaving}>
          Finish Workout
        </Button>
      </div>
      <LeavingConfirmationModal
        isOpen={showModal}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
      />
      <FinishWorkoutModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleSaveChanges}
        isLoading={isSaving}
        defaultTitle={workout?.name ?? 'Workout'}
        startTime={startTime ?? new Date()}
      />
    </div>
  );
}

export default StartWorkout;
