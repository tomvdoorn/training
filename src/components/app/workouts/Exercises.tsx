import React, { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "~/components/ui/table";
import ExerciseSet from "./ExerciseSet";
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import { ChevronUp, ChevronDown, CheckCircle, MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import FileUploadModal from '~/components/app/workouts/FileUploadModal'
import { Textarea } from "~/components/ui/textarea";
import type { Exercise as ExerciseType, SessionExerciseSet, TemplateExerciseSet, SetType } from "@prisma/client";
import { supabase } from '~/utils/supabaseClient'
import { useAuthSession } from "~/hooks/useSession";
import { uploadFileToStorage } from '~/utils/supabase';

type PartialTemplateExerciseSet = Partial<TemplateExerciseSet> & {
  isNew?: boolean;
  deleted?: boolean;
  tempId?: string;
};


interface ExerciseProps {
  templateExerciseId: number;
  template_id?: number;
  exerciseIndex: number;
  exercise: ExerciseType;
  sets?: (TemplateExerciseSet & { deleted?: boolean })[];
  workoutIndex: number;
  start: boolean;
  onReorder: (fromIndex: number, toIndex: number) => void;
  templateExercise?: {
    id?: number;
    notes?: string | null;
    deleted?: boolean;
    sets?: PartialTemplateExerciseSet[];
    is_copy?: boolean;
  };
  setDataOption?: 'lastSession' | 'prSession' | 'template' | undefined;
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

const setTypeColors = {
  Regular: 'bg-gray-50',
  Warmup: 'bg-yellow-50',
  Dropset: 'bg-red-50',
  Superset: 'bg-purple-50',
  Partials: 'bg-blue-50',
  // Add more types and colors as needed
};



const Exercise = ({
  templateExerciseId,
  exerciseIndex,
  exercise,
  sets,
  workoutIndex,
  start,
  onReorder,
  setDataOption,
  lastSessionData,
  prSessionData,
  templateExercise
}: ExerciseProps) => {
  const { addSet, removeExercise, updateExercise, addPendingMedia } = useWorkoutTemplateStore();
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(!!templateExercise?.notes);
  const [notes, setNotes] = useState(templateExercise?.notes ?? '');

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

  const handleMoveUp = () => {
    if (exerciseIndex > 0) {
      onReorder(exerciseIndex, exerciseIndex - 1);
    }
  };

  const handleMoveDown = () => {
    onReorder(exerciseIndex, exerciseIndex + 1);
  };

  const handleFileUpload = () => {
    setIsFileUploadModalOpen(true);
  };

  const session = useAuthSession();
  if (!session?.user?.id) {
    console.error('No user session found');
    return null;
  }

  const handleFileUploadComplete = async (file: File, selectedSets: number[]) => {
    try {
      const fileUrl = await uploadFileToStorage(file, session?.supabaseAccessToken ?? '');

      if (!fileUrl) {
        console.error('Failed to upload file');
        return;
      }

      const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
      let fileType = 'unknown';

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
        fileType = 'image';
      } else if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension)) {
        fileType = 'video';
      }

      addPendingMedia(templateExerciseId, {
        file: fileUrl,
        fileType,
        setIndices: selectedSets
      })
      console.log(addPendingMedia)

        ;
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    updateExercise(templateExerciseId, { notes: e.target.value });
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
    if (!notes) {
      setNotes('');
    }
  };

  return (
    <>
      <div
        className={`mb-6 p-4 mt-8 rounded-lg ${exerciseIndex % 2 === 0 ? 'bg-slate-50' : 'bg-zinc-50'} shadow-sm transition-all duration-200 hover:shadow-md`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium">{exercise.name}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAddSet}>
              Add Set
            </Button>
            <Button variant="outline" size="icon" onClick={handleMoveUp} disabled={exerciseIndex === 0}>
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleMoveDown}>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleFileUpload}>Upload Media</DropdownMenuItem>
                <DropdownMenuItem onSelect={toggleNotes}>
                  {notes ? 'Edit Notes' : 'Add Notes'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDeleteExercise}>Delete Exercise</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {(notes ?? showNotes) && (
          <Textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add notes for this exercise..."
            className="w-full mb-4"
          />
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Set</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Reps</TableHead>
              {start ? (
                <TableHead className="text-left">
                  <TooltipProvider>

                    <Tooltip>
                      <TooltipTrigger>
                        <span className="sr-only">Completed</span>
                        <CheckCircle className="w-4 h-4 mx-auto lg:hidden" />
                        <p className="align-left text-sm hidden lg:block">Completed</p>
                      </TooltipTrigger>
                      <TooltipContent>Mark set as completed</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sets ? (sets.filter((set): set is TemplateExerciseSet => !('deleted' in set) || !set.deleted).map((set, setIndex) => (
              <ExerciseSet
                key={`${exerciseIndex}-${setIndex}`}
                setIndex={setIndex}
                set={set}
                workoutIndex={workoutIndex}
                exerciseIndex={exerciseIndex}
                templateExerciseId={templateExerciseId}
                start={start ?? false}
                setTypeColors={setTypeColors}
                setDataOption={setDataOption}
                lastSessionData={lastSessionData}
                prSessionData={prSessionData}
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
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={() => setIsFileUploadModalOpen(false)}
        onUpload={handleFileUploadComplete}
        sets={sets as TemplateExerciseSet[]}
      />
    </>
  );
};

export default Exercise;
