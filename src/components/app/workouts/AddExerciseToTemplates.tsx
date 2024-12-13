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
import Image from 'next/image'

interface AddExerciseToTemplateProps {
  templateId: number;
  onExerciseAdded: (exercise: TemplateExercise) => void;
  isModal?: boolean;
}

// Helper function to generate initials from exercise name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

// Helper function to generate SVG data URI with initials
const generateInitialsSVG = (initials: string): string => {
  const bgColor = '#4F46E5'; // Example background color
  const textColor = '#FFFFFF'; // Example text color
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="${bgColor}" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="40" font-family="Arial, Helvetica, sans-serif">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

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
      <div className="mb-4 bg-gray-800/50">
        <h3 className="text-lg font-semibold mb-2">Add Exercise</h3>
        <p className="text-sm text-brand-light mb-4">Search for exercises or add a new one!</p>
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
            <Button variant="outline" className="whitespace-nowrap bg-brand-gradient-r text-gray-900 hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Exercise
            </Button>
          </AddExercise>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {filteredExercises.map((exercise) => {
          const initials = getInitials(exercise.name);
          const fallbackSrc = generateInitialsSVG(initials);
          return (
            <div className="bg-gray-800/50 p-2 mb-2 rounded-lg" key={exercise.id}>
              <div className="flex flex-row mb-2 mt-2">
                <Image
                  src={exercise.image ? exercise.image : fallbackSrc}
                  alt={exercise.name}
                  width={100}
                  height={100}
                  className="rounded-md mr-2"
                />
                <div className="font-medium basis-2/3">{exercise.name}
                  <div className="flex items-center flex-wrap ">
                    <p className="basis-2/3 text-brand-light text-muted-foreground text-sm">{exercise.description}</p>
                  </div></div>
                <Button className="align bg-brand-gradient-r text-gray-900 hover:opacity-90" onClick={() => selectExercise(exercise.id)}>Add</Button>

              </div>

            </div>
          );
        })}
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
          <Button className="bg-brand-gradient-r text-gray-900 hover:opacity-90">Add Exercise</Button>
        </CredenzaTrigger>
        <CredenzaContent className="h-4/6 bg-brand-dark">
          <CredenzaBody className="overflow-x-scroll">
            {content}
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
