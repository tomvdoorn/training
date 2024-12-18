import { create } from 'zustand';
import { produce } from 'immer';
import type { Template, TemplateExercise, TemplateExerciseSet, Exercise, SessionExerciseSet } from '@prisma/client';


// Define more specific types for our state
type PendingMedia = {
  file: string;
  fileType: string;
  setIndices: number[];
};

type PartialTemplateExercise = Partial<Omit<TemplateExercise, 'id'>> & {
  id?: string | number;
  isNew?: boolean;
  deleted?: boolean;
  exercise?: Exercise;
  sets?: PartialTemplateExerciseSet[];
  pendingMedia?: PendingMedia[];
};

type PartialTemplateExerciseSet = Partial<Omit<TemplateExerciseSet, 'reps' | 'weight' | 'duration' | 'distance' | 'rpe'>> & {
  isNew?: boolean;
  deleted?: boolean;
  tempId?: string | number;
  completed?: boolean;
  reps?: number | null;
  weight?: number | null;
  duration?: number | null;
  distance?: number | null;
  rpe?: number | null;
  reps_template?: number | null;
  weight_template?: number | null;
};

interface WorkoutTemplateState {
  template: Partial<Template> | null;
  exercises: PartialTemplateExercise[];
  hasUnsavedChanges: boolean;
  isSessionMode: boolean;
  generalMedia: PendingMedia[];
}

export interface addExerciseState extends Partial<TemplateExercise> {
  exercise: Exercise;
  templateId?: number;
  sets?: PartialTemplateExerciseSet[];
}

interface WorkoutTemplateActions {
  updateTemplate: (templateData: Partial<Template>) => void;
  addExercise: (exercise: Partial<addExerciseState>) => void;
  updateExercise: (exerciseId: number | string, exerciseData: Partial<TemplateExercise>) => void;
  removeExercise: (exerciseId: number | string) => void;
  addSet: (exerciseId: number | string, newSet: Partial<TemplateExerciseSet>) => void;
  updateSet: (exerciseId: number | string, setId: number | string, setData: Partial<TemplateExerciseSet>) => void;
  removeSet: (exerciseId: number | string, setId: number | string) => void;
  resetChanges: () => void;
  initializeExercises: (exercises: TemplateExercise[]) => void;
  setSessionMode: (isSessionMode: boolean) => void;
  updateSessionSet: (exerciseId: number, setId: number | string, setData: Partial<SessionExerciseSet>) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;
  resetUnsavedChanges: () => void;
  addPendingMedia: (exerciseId: number | string, media: { file: string; fileType: string; setIndices: number[] }) => void;
  addGeneralMedia: (media: PendingMedia) => void;
}
const initialState: WorkoutTemplateState = {
  template: null,
  exercises: [],
  hasUnsavedChanges: false,
  isSessionMode: false,
  generalMedia: [],
};

// Helper function to compare IDs (can be either number or string)
const isSameId = (id1: number | string, id2: number | string) => {
  return typeof id1 === typeof id2 ? id1 === id2 : String(id1) === String(id2);
};

export const useWorkoutTemplateStore = create<WorkoutTemplateState & WorkoutTemplateActions>((set) => ({
  ...initialState,

  updateTemplate: (templateData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        state.template = { ...state.template, ...templateData };
        state.hasUnsavedChanges = true;
      })
    ),

  addExercise: (exercise) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        state.exercises.push({
          ...exercise,
          id: tempId,
          isNew: true,
          sets: [{
            type: 'Regular',
            isNew: true,
            tempId: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            reps: 0,
            weight: 0,
          }],
        });
        state.hasUnsavedChanges = true;
      })
    ),

  updateExercise: (exerciseId, exerciseData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => isSameId(e.id!, exerciseId));
        if (exerciseIndex !== -1) {
          state.exercises[exerciseIndex] = {
            ...state.exercises[exerciseIndex]!,
            ...exerciseData,
            notes: exerciseData.notes !== undefined 
              ? exerciseData.notes 
              : state.exercises[exerciseIndex]!.notes,
          };
          state.hasUnsavedChanges = true;
        }
      })
    ),

  removeExercise: (exerciseId) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => isSameId(e.id!, exerciseId));
        if (exerciseIndex !== -1) {
          if (state.exercises[exerciseIndex]!.isNew) {
            state.exercises.splice(exerciseIndex, 1);
          } else {
            state.exercises[exerciseIndex]!.deleted = true;
          }
          state.hasUnsavedChanges = true;
        }
      })
    ),

  addSet: (exerciseId, setData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => isSameId(e.id!, exerciseId));
        if (exerciseIndex !== -1) {
          const tempId = `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          state.exercises[exerciseIndex]!.sets = state.exercises[exerciseIndex]!.sets ?? [];
          state.exercises[exerciseIndex]!.sets.push({
            ...setData,
            isNew: true,
            tempId,
          });
          state.hasUnsavedChanges = true;
        }
      })
    ),

  updateSet: (exerciseId, setId, setData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => isSameId(e.id!, exerciseId));
        if (exerciseIndex !== -1 && state.exercises[exerciseIndex]!.sets) {
          const setIndex = state.exercises[exerciseIndex]!.sets.findIndex((s) => 
            isSameId(s.isNew ? s.tempId! : s.id!, setId)
          );
          if (setIndex !== -1) {
            state.exercises[exerciseIndex]!.sets[setIndex] = {
              ...state.exercises[exerciseIndex]!.sets[setIndex],
              ...setData,
            };
            state.hasUnsavedChanges = true;
          }
        }
      })
    ),

  removeSet: (exerciseId, setId) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => isSameId(e.id!, exerciseId));
        if (exerciseIndex !== -1 && state.exercises[exerciseIndex]!.sets) {
          const setIndex = state.exercises[exerciseIndex]!.sets.findIndex((s) => {
            if (s.isNew && typeof setId === 'string') {
              return s.tempId === setId;
            }
            return s.id === setId;
          });
          if (setIndex !== -1) {
            if (state.exercises[exerciseIndex]!.sets[setIndex]!.isNew) {
              state.exercises[exerciseIndex]!.sets = [
                ...state.exercises[exerciseIndex]!.sets.slice(0, setIndex),
                ...state.exercises[exerciseIndex]!.sets.slice(setIndex + 1)
              ];
            } else {
              state.exercises[exerciseIndex]!.sets[setIndex]!.deleted = true;
            }
            state.hasUnsavedChanges = true;
          }
        }
      })
    ),

  resetChanges: () => set(initialState),

  initializeExercises: (exercises: PartialTemplateExercise[]) =>
    set(
      produce((state: WorkoutTemplateState) => {
        state.exercises = exercises.map((exercise) => ({ 
          ...exercise, 
          sets: exercise.sets?.map(set => ({ ...set })) ?? []
        }));
      })
    ),

  setSessionMode: (isSessionMode) =>
    set(
      produce((state: WorkoutTemplateState) => {
        state.isSessionMode = isSessionMode;
      })
    ),

  updateSessionSet: (exerciseId, setId, setData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => e.id === exerciseId);
        if (exerciseIndex !== -1 && state.exercises[exerciseIndex]!.sets) {
          const setIndex = state.exercises[exerciseIndex]!.sets.findIndex((s) => 
            (typeof setId === 'number' ? s.id === setId : s.tempId === setId)
          );
          if (setIndex !== -1) {
            state.exercises[exerciseIndex]!.sets[setIndex] = {
              ...state.exercises[exerciseIndex]!.sets[setIndex],
              ...setData,
              completed: setData.completed ?? state.exercises[exerciseIndex]!.sets[setIndex]!.completed
            };
          }
        }
        state.hasUnsavedChanges = true;
      })
    ),

  reorderExercises: (fromIndex: number, toIndex: number) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const [reorderedItem] = state.exercises.splice(fromIndex, 1);
        if (reorderedItem) {
          state.exercises.splice(toIndex, 0, reorderedItem);
          state.hasUnsavedChanges = true;
        }
      })
    ),

  resetUnsavedChanges: () =>
    set(
      produce((state: WorkoutTemplateState) => {
        state.hasUnsavedChanges = false;
      })
    ),

  addPendingMedia: (exerciseId, mediaData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => isSameId(e.id!, exerciseId));
        if (exerciseIndex !== -1) {
          state.exercises[exerciseIndex]!.pendingMedia = 
            state.exercises[exerciseIndex]!.pendingMedia ?? [];
          state.exercises[exerciseIndex]!.pendingMedia.push(mediaData);
          state.hasUnsavedChanges = true;
        }
      })
    ),

  addGeneralMedia: (media: PendingMedia) =>
    set(
      produce((state: WorkoutTemplateState) => {
        state.generalMedia.push(media);
        state.hasUnsavedChanges = true;
      })
    ),
}));
