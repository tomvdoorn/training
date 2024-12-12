import type { TrainingSession, PRType, SessionExerciseSet, SessionExercise, ExercisePersonalRecord } from "@prisma/client";

interface WeeklyStats {
  completedSessions: number;
  timeSpent: number; // in minutes
  personalRecords: number;
}

interface ExtendedTrainingSession extends TrainingSession {
  exercises: Array<
    Partial<SessionExercise> & {
      sets?: Array<
        Partial<SessionExerciseSet> & {
          personalRecords?: Array<Partial<ExercisePersonalRecord>>;
        }
      >;
    }
  >;
}


export function calculateWeeklyStats(sessions: ExtendedTrainingSession[]): WeeklyStats {
  return {
    completedSessions: sessions.length,
    timeSpent: sessions.reduce((total, session) => {
      const duration = session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
        : 0;
      return total + duration;
    }, 0),
    personalRecords: sessions.reduce((total, session) => {
        if (session.exercises) {
            return total + session.exercises.reduce((exerciseTotal: number, exercise) => {
                if (exercise.sets) {
                    return exerciseTotal + exercise.sets.reduce((setTotal: number, set) => {
                        return setTotal + (set.personalRecords ? 1 : 0);
                    }, 0);
                }
                return exerciseTotal;
            }, 0);
        }
        return total;
    }, 0),
  };
}

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
} 