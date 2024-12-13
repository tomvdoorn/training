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
      className="bg-brand-gradient-r text-gray-900 hover:opacity-90"
    >
      {isLoading ? 'Saving...' : 'Save Changes'}
    </Button>
  );
};