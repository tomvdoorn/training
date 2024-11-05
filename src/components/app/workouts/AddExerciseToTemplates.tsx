import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaTrigger,
} from "@/components/ui/credenza"
import { Button } from "@/components/ui/button"
import { api } from "~/trpc/react";
import AddExercise from "./AddExercise";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import type { TemplateExercise } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddExerciseToTemplateProps {
  templateId: number;
  onExerciseAdded: (exercise: TemplateExercise) => void;
  isModal?: boolean;
}

export default function AddExerciseToTemplate({ templateId, onExerciseAdded, isModal = true }: AddExerciseToTemplateProps) {
  const router = useRouter();
  const { data: exercises, error, isLoading } = api.exercise.getExercises.useQuery();
  const { addExercise } = useWorkoutTemplateStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exercises, searchTerm]);

  const content = (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Add Exercise</h3>
        <p className="text-sm text-gray-500 mb-4">Search for exercises or add a new one!</p>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <AddExercise 
            templateId={templateId}
            onExerciseAdded={addExercise}
          >
            <Button variant="outline" className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Exercise
            </Button>
          </AddExercise>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {filteredExercises.map((exercise) => (
          <div className="bg-slate-50 p-2 mb-2" key={exercise.id}>
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
      </div>
      {filteredExercises.length === 0 && (
        <p className="text-center text-gray-500">No matching exercises found</p>
      )}
    </>
  );

  if (!isModal) {
    return <div className="h-full overflow-y-auto">{content}</div>;
  }

  return (
    <div>
      <Credenza onOpenChange={setIsOpen} open={isOpen}>
        <CredenzaTrigger asChild>
          <Button>Add Exercise</Button>
        </CredenzaTrigger>
        <CredenzaContent className="h-4/6">
          <CredenzaBody className="overflow-x-scroll">
            {content}
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
