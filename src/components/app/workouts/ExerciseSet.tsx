import React, { useCallback } from "react";
import { TableRow, TableCell } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { type TemplateExerciseSet, SessionExerciseSet, SetType } from "@prisma/client";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "~/components/ui/select";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import { Checkbox } from "~/components/ui/checkbox";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface ExerciseSetProps {
  workoutIndex: number;
  exerciseIndex: number;
  setIndex: number;
  set: Partial<TemplateExerciseSet & { completed?: boolean }> & { isNew?: boolean; tempId?: string };
  templateExerciseId: number;
  start: boolean;
  setTypeColors: Record<string, string>;
  setDataOption: 'lastSession' | 'prSession' | 'template' | undefined;
  lastSessionData?: {
    exercises: Array<{
      id: number;
      templateExerciseId: number | null;
      sets: Array<{
        reps: number | null;
        weight: number | null;
        type: SetType;
      }>;
    }>;
  };
  prSessionData?: Array<{
      id: number;
      sets: Array<Partial<SessionExerciseSet>>;
  }>;
}

const ExerciseSet = ({
  setIndex,
  set,
  templateExerciseId,
  start,
  setTypeColors,
  setDataOption,
  lastSessionData,
  prSessionData
}: ExerciseSetProps) => {
  const { updateSet, removeSet } = useWorkoutTemplateStore();

  const getPlaceholderData = useCallback(() => {
    switch (setDataOption) {
      case 'lastSession':
        return lastSessionData?.exercises?.find(e => e.templateExerciseId === templateExerciseId)?.sets?.[setIndex] ?? {};
      case 'prSession':
        console.log('prSessionData?', prSessionData);
        const exerciseData = prSessionData?.[templateExerciseId];
        return exerciseData?.sets?.[setIndex] ?? {};
      default:
        return set; // Use template data as default
    }
  }, [setDataOption, lastSessionData, prSessionData, templateExerciseId, setIndex, set]);

  const placeholderData = getPlaceholderData();

  const handleInputChange = useCallback((field: keyof (TemplateExerciseSet & { completed?: boolean }), value: string | number | boolean) => {
    const updatedFields: Partial<TemplateExerciseSet & { completed?: boolean }> = { [field]: value };

    if (field === 'completed' && value === true) {
      // If marking as completed and weight or reps are undefined, use placeholder data
      if (set.weight === undefined) {
        updatedFields.weight = placeholderData.weight ?? 0;
      }
      if (set.reps === undefined) {
        updatedFields.reps = placeholderData.reps ?? 0;
      }
    }

    updateSet(templateExerciseId, set.isNew ? set.tempId! : set.id!, updatedFields);
  }, [templateExerciseId, set, placeholderData, updateSet]);

  const handleRemoveSet = useCallback(() => {
    removeSet(templateExerciseId, set.isNew ? set.tempId! : set.id!);
  }, [templateExerciseId, set.id, set.tempId, set.isNew, removeSet]);

  const selectorColor = setTypeColors[set.type as string] ?? 'bg-white';




  return (
    <TableRow 
      key={setIndex} 
      className={cn(
        set.completed ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-gray-100',
        'transition-colors duration-200'
      )}
    >
      <TableCell>{setIndex + 1}</TableCell>
      <TableCell>
        <Select 
          value={set.type}
          onValueChange={(value) => handleInputChange('type', value as SetType)}
        >
          <SelectTrigger className={`w-full ${selectorColor}`}>
            <SelectValue placeholder="Select type">
              {set.type && (
                <>
                  <span className="hidden md:inline">{set.type}</span>
                  <span className="md:hidden">{set.type[0]}</span>
                </>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.values(SetType).map((type) => (
              <SelectItem key={type} value={type} className={setTypeColors[type]}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          value={set.completed ? (set.weight?.toString() ?? '') : (start ? undefined : set.weight?.toString() ?? '')}
          onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) ?? 0)}
          placeholder={placeholderData.weight?.toString() ?? ''}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          value={set.completed ? (set.reps?.toString() ?? '') : (start ? undefined : set.reps?.toString() ?? '')}
          onChange={(e) => handleInputChange('reps', parseInt(e.target.value) ?? 0)}
          placeholder={placeholderData.reps?.toString() ?? ''}
        />
      </TableCell>
      {start ? 
      <TableCell className="items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Checkbox
                checked={set.completed ?? false}
                onCheckedChange={(checked) => handleInputChange('completed', checked)}
                aria-label="Mark set as completed"
              />
            </TooltipTrigger>
            <TooltipContent>Mark set as completed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell> : null
      }
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
