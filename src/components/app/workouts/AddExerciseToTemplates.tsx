import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza"
import { Button } from "@/components/ui/button"
import { api } from "~/trpc/react";
import AddExercise from "./AddExercise";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import type { TemplateExercise } from "@prisma/client";

interface AddExerciseToTemplateProps {
  templateId: number;
  onExerciseAdded: (newExercise: TemplateExercise) => void;
}

export default function AddExerciseToTemplate({ templateId, onExerciseAdded  }: AddExerciseToTemplateProps) {
  const router = useRouter();
  const { data: exercises, error, isLoading } = api.exercise.getExercises.useQuery();
  const { addExercise } = useWorkoutTemplateStore();
  const [isOpen, setIsOpen] = useState(false);

  const maxOrderResult = api.template.getExercisesInTemplate.useQuery({
    templateId,
  });

  const selectExercise = (exerciseId: number) => {
    const newExercise = exercises?.find((exercise) => exercise.id === exerciseId);
    if (newExercise) {
      const maxOrder = maxOrderResult.data?.length ?? 0;
      addExercise({
        templateId,
        exercise: newExercise,
        order: maxOrder + 1,
      });
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Credenza onOpenChange={setIsOpen} open={isOpen}>
        <CredenzaTrigger asChild>
          <Button>Add Exercise</Button>
        </CredenzaTrigger>
        <CredenzaContent className="h-4/6">
          <CredenzaHeader>
            <CredenzaTitle>Add Exercise</CredenzaTitle>
            <CredenzaDescription>
              <div className="flex flex-row"> 
                <div className="px-4">No search yet so have fun scrolling!</div>   
                <AddExercise 
                  templateId={templateId}
                  onExerciseAdded={addExercise}

                />
                <div className="bg-black h-1"> </div>
              </div>
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="overflow-x-scroll">
            {exercises?.map((exercise) => (
              <div className="bg-slate-50 p-2" key={exercise.id}>
                <div className="flex flex-row mb-2 mt-2">
                  <img src={exercise.image ?? undefined } alt='img' className="w-10 h-10 object-cover rounded-lg basis-1/3" />
                  <div className="font-medium basis-2/3">{exercise.name}</div>
                  <Button className="align" onClick={() => selectExercise(exercise.id)}>Add</Button>
                </div>
                <div className="flex items-center flex-wrap ">
                  <p className="basis-2/3">{exercise.description}</p>
                </div>
              </div>
            ))}
          </CredenzaBody>
          <CredenzaFooter>
            Scrolling is your first workout!
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}