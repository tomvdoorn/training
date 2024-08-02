import React, { useCallback } from "react";
import { TableRow, TableCell } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { type TemplateExerciseSet, SetType } from "@prisma/client";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "~/components/ui/select";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';

interface ExerciseSetProps {
  workoutIndex: number;
  exerciseIndex: number;
  setIndex: number;
  set: Partial<TemplateExerciseSet> & { isNew?: boolean; tempId?: string };
  templateExerciseId: number;
}

const ExerciseSet = ({
  setIndex,
  set,
  templateExerciseId,
}: ExerciseSetProps) => {
  const { updateSet, removeSet } = useWorkoutTemplateStore();

  const handleInputChange = useCallback((field: keyof TemplateExerciseSet, value: string | number) => {
    updateSet(templateExerciseId, set.isNew ? set.tempId! : set.id!, { [field]: value });
  }, [templateExerciseId, set.id, set.tempId, set.isNew, updateSet]);

  const handleRemoveSet = useCallback(() => {
    removeSet(templateExerciseId, set.isNew ? set.tempId! : set.id!);
  }, [templateExerciseId, set.id, set.tempId, set.isNew, removeSet]);

  return (
    <TableRow key={setIndex}>
      <TableCell>{setIndex + 1}</TableCell>
      <TableCell>
        <Select 
          value={set.type}
          onValueChange={(value) => handleInputChange('type', value as SetType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SetType).map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={set.weight?.toString() ?? ''}
          onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={set.reps?.toString() ?? ''}
          onChange={(e) => handleInputChange('reps', parseInt(e.target.value) || 0)}
        />
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveSet}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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
  );
}

export default ExerciseSet;