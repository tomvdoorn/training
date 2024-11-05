import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import { useHandleUnsavedChanges } from '~/hooks/useHandleUnsavedChanges';
import { useEffect, useCallback } from 'react';

export function useSessionHandler() {
  const { 
    exercises, 
    hasUnsavedChanges, 
    updateSessionSet, 
    setSessionMode,
    addExercise,
    updateTemplate,
    initializeExercises,
    resetChanges,
    reorderExercises
  } = useWorkoutTemplateStore();

  const { 
    showModal, 
    checkUnsavedChanges, 
    handleConfirmNavigation, 
    handleCancelNavigation 
  } = useHandleUnsavedChanges();

  useEffect(() => {
    setSessionMode(true);
    return () => setSessionMode(false);
  }, [setSessionMode]);

  const handleSetCompletion = useCallback((exerciseId: number, setId: number | string, completed: boolean) => {
    updateSessionSet(exerciseId, setId, { completed });
  }, [updateSessionSet]);

  // Add more session-specific functions here

  return {
    exercises,
    hasUnsavedChanges,
    showModal,
    checkUnsavedChanges,
    handleConfirmNavigation,
    handleCancelNavigation,
    handleSetCompletion,
    addExercise,
    updateTemplate,
    initializeExercises,
    resetChanges,
    reorderExercises
    // Return other session-specific functions
  };
}

