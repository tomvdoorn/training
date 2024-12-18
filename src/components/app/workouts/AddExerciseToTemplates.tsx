import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { api } from "~/trpc/react";
import AddExercise from "./AddExercise";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import type { TemplateExercise } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import Image from 'next/image'
import type { addExerciseState } from '~/stores/workoutTemplateStore';

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
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="20" font-family="Arial, Helvetica, sans-serif">${initials}</text>
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

  const handleExerciseAdded = (exercise: Partial<addExerciseState>) => {
    addExercise(exercise);
    setIsOpen(false);
  };

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
            onExerciseAdded={handleExerciseAdded}
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
            <div className="bg-gray-800/50 p-2 mb-2 rounded-lg max-h-[200px]" key={exercise.id}>
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <Image
                  src={exercise.image ? exercise.image : fallbackSrc}
                  alt={exercise.name}
                  width={80}
                  height={80}
                  className="rounded-md row-span-2"
                />
                <div className="flex justify-between items-center">
                  <div className="font-medium">{exercise.name}</div>
                  <Button
                    className="bg-brand-gradient-r text-gray-900 hover:opacity-90 shrink-0"
                    onClick={() => selectExercise(exercise.id)}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-brand-light text-muted-foreground text-sm">{exercise.description}</p>
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-brand-gradient-r text-gray-900 hover:opacity-90">Add Exercise</Button>
        </DialogTrigger>

        <DialogContent className="h-[90vh] max-w-3xl w-[90vw] bg-brand-dark p-6">
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
            <DialogDescription>Add an exercise to your template</DialogDescription>
          </DialogHeader>
          <div className="h-full overflow-y-auto pr-6">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
