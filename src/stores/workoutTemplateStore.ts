import { create } from 'zustand';
import { produce } from 'immer';
import type { Template, TemplateExercise, TemplateExerciseSet, Exercise } from '@prisma/client';


// Define more specific types for our state
type PartialTemplateExercise = Partial<TemplateExercise> & {
  isNew?: boolean;
  deleted?: boolean;
  exercise?: Exercise;
  sets?: PartialTemplateExerciseSet[];
};

type PartialTemplateExerciseSet = Partial<TemplateExerciseSet> & {
  isNew?: boolean;
  deleted?: boolean;
  tempId?: string;
};

interface WorkoutTemplateState {
  template: Partial<Template> | null;
  exercises: PartialTemplateExercise[];
  hasUnsavedChanges: boolean;
}
interface addExerciseState extends Partial<TemplateExercise> {
  exercise: Exercise;
}
interface WorkoutTemplateActions {
  updateTemplate: (templateData: Partial<Template>) => void;
  addExercise: (exercise: Partial<addExerciseState>) => void;
  updateExercise: (exerciseId: number, exerciseData: Partial<TemplateExercise>) => void;
  removeExercise: (exerciseId: number) => void;
  addSet: (exerciseId: number, newSet: Partial<TemplateExerciseSet>) => void;
  updateSet: (exerciseId: number, setId: number | string, setData: Partial<TemplateExerciseSet>) => void;
  removeSet: (exerciseId: number, setId: number | string) => void;
  resetChanges: () => void;
  initializeExercises: (exercises: TemplateExercise[]) => void;
}

const initialState: WorkoutTemplateState = {
  template: null,
  exercises: [],
  hasUnsavedChanges: false,
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
        state.exercises.push({ ...exercise, isNew: true, sets: [] });
        state.hasUnsavedChanges = true;
      })
    ),

  updateExercise: (exerciseId, exerciseData) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => e.id === exerciseId);
        if (exerciseIndex !== -1) {
          state.exercises[exerciseIndex] = { ...state.exercises[exerciseIndex], ...exerciseData };
        }
        state.hasUnsavedChanges = true;
      })
    ),

  removeExercise: (exerciseId) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => e.id === exerciseId);
        if (exerciseIndex !== -1) {
          if (state.exercises[exerciseIndex]!.isNew) {
            state.exercises.splice(exerciseIndex, 1);
          } else {
            state.exercises[exerciseIndex]!.deleted = true;
          }
        }
        state.hasUnsavedChanges = true;
      })
    ),

  addSet: (exerciseId, newSet) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => e.id === exerciseId);
        if (exerciseIndex !== -1) {
          if (state.exercises[exerciseIndex]!.sets) {
            state.exercises[exerciseIndex]!.sets = [];
          }
          const tempId = `temp-${Date.now()}`;
          state.exercises[exerciseIndex]!.sets?.push({ ...newSet, isNew: true, tempId });
        }
        state.hasUnsavedChanges = true;
      })
    ),

  updateSet: (exerciseId, setId, setData) =>
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
              ...setData
            };
          }
        }
        state.hasUnsavedChanges = true;
      })
    ),

  removeSet: (exerciseId, setId) =>
    set(
      produce((state: WorkoutTemplateState) => {
        const exerciseIndex = state.exercises.findIndex((e) => e.id === exerciseId);
        if (exerciseIndex !== -1 && state.exercises[exerciseIndex]!.sets) {
          const setIndex = state.exercises[exerciseIndex]!.sets.findIndex((s) => 
            (typeof setId === 'number' ? s.id === setId : s.tempId === setId)
          );
          if (setIndex !== -1) {
            const set = state.exercises[exerciseIndex]!.sets[setIndex];
            if (set!.isNew) {
              state.exercises[exerciseIndex]!.sets.splice(setIndex, 1);
            } else {
              state.exercises[exerciseIndex]!.sets[setIndex]!.deleted = true;
            }
          }
        }
        state.hasUnsavedChanges = true;
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
}));