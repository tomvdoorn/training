import React from 'react';
import { Button } from "@/components/ui/button"
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';

interface FinishButtonProps {
  onSave: () => void;
  isLoading: boolean;
}

export const FinishButton: React.FC<FinishButtonProps> = ({ onSave, isLoading }) => {
  const hasUnsavedChanges = useWorkoutTemplateStore(state => state.hasUnsavedChanges);

  return (
    <Button
      onClick={onSave}
      disabled={!hasUnsavedChanges || isLoading}
    >
      {isLoading ? 'Finishing workout...' : 'Finish Workout'}
    </Button>
  );
};