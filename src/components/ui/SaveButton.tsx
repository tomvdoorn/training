import React from 'react';
import { Button } from "@/components/ui/button"
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';

interface SaveButtonProps {
  onSave: () => void;
  isLoading: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onSave, isLoading }) => {
  const hasUnsavedChanges = useWorkoutTemplateStore(state => state.hasUnsavedChanges);

  return (
    <Button
      onClick={onSave}
      disabled={!hasUnsavedChanges || isLoading}
    >
      {isLoading ? 'Saving...' : 'Save Changes'}
    </Button>
  );
};