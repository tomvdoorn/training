// src/hooks/useHandleUnsavedChanges.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';

export function useHandleUnsavedChanges() {
  const router = useRouter();
  const { hasUnsavedChanges, isSessionMode, resetUnsavedChanges } = useWorkoutTemplateStore(state => ({
    hasUnsavedChanges: state.hasUnsavedChanges,
    isSessionMode: state.isSessionMode,
    resetUnsavedChanges: state.resetUnsavedChanges
  }));
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = isSessionMode ? 'You have an ongoing session. Are you sure you want to leave?' : 'You have unsaved changes. Are you sure you want to leave?';
    }
  }, [hasUnsavedChanges, isSessionMode]);

  const handlePopState = useCallback((event: PopStateEvent) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
        // Allow the navigation
        return;
      }
      // Prevent the navigation
      event.preventDefault();
      // Push the current state back to the history to stay on the current page
      window.history.pushState(null, '', window.location.href);
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, handleBeforeUnload, handlePopState]);

  const checkUnsavedChanges = useCallback((href: string) => {
    if (hasUnsavedChanges) {
      setShowModal(true);
      setPendingNavigation(href);
      return false;
    }
    return true;
  }, [hasUnsavedChanges]);

  const handleConfirmNavigation = useCallback(() => {
    setShowModal(false);
    if (pendingNavigation) {
      resetUnsavedChanges();
      router.push(pendingNavigation);
    }
  }, [pendingNavigation, router, resetUnsavedChanges]);

  const handleCancelNavigation = useCallback(() => {
    setShowModal(false);
    setPendingNavigation(null);
  }, []);

  return { showModal, checkUnsavedChanges, handleConfirmNavigation, handleCancelNavigation };
}
