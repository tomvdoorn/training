import { useState, useEffect } from 'react';

export function useWorkoutTimer() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Set the initial start time
  useEffect(() => {
    if (!startTime) {
      const now = new Date();
      setStartTime(now);
    }
  }, []);

  // Handle the timer updates
  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      const currentTime = new Date();
      const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    startTime,
    elapsedTime,
    formattedTime: formatElapsedTime(elapsedTime)
  };
} 