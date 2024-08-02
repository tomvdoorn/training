import React, { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table";
import type { Exercise as ExerciseType } from "@prisma/client";
import ExerciseSet from "./ExerciseSet";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import type { TemplateExerciseSet } from "@prisma/client";

type PartialTemplateExerciseSet = Partial<TemplateExerciseSet> & {
  isNew?: boolean;
  deleted?: boolean;
  tempId?: string;
};
interface ExerciseProps {
  templateExerciseId: number;
  exerciseIndex: number;
  exercise: ExerciseType;
  sets?: PartialTemplateExerciseSet[];
  workoutIndex: number;
  template_id?: number;
}


const Exercise = ({
  templateExerciseId,
  exerciseIndex,
  exercise,
  sets,
  workoutIndex,
}: ExerciseProps) => {
  const { addSet, removeExercise, updateExercise } = useWorkoutTemplateStore();

  const handleAddSet = useCallback(() => {
    const newSet: Partial<TemplateExerciseSet> = {
      reps: 0,
      weight: 0,
      type: 'Regular',
    };
    addSet(templateExerciseId, newSet);
  }, [templateExerciseId, addSet]);

  const handleDeleteExercise = useCallback(() => {
    removeExercise(templateExerciseId);
  }, [templateExerciseId, removeExercise]);

  const handleUpdateExercise = useCallback((data: Partial<ExerciseType>) => {
    updateExercise(templateExerciseId, data);
  }, [templateExerciseId, updateExercise]);

  return (
    <div className={`mb-6 p-4 mt-8 rounded-lg ${exerciseIndex % 2 === 0 ? 'bg-slate-50' : 'bg-zinc-50'} shadow-sm`}>
      <div className="flex items-center justify-between mb-4 ">
        <div className="font-medium">{exercise.name}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAddSet}>
            Add Set
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoveHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDeleteExercise}>Delete Exercise</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{exercise.description}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Set</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Reps</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets ? (sets.filter(set => !set.deleted).map((set, setIndex) => (
            <ExerciseSet
              key={`${exerciseIndex}-${setIndex}`}
              setIndex={setIndex}
              set={set}
              workoutIndex={workoutIndex}
              exerciseIndex={exerciseIndex}
              templateExerciseId={templateExerciseId}
            />
          )))
        : 
        (
          <div className="p-4 text-center">No Sets Added</div>
        )
      }
        </TableBody>
      </Table>
    </div>
  );
};

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

export default Exercise;