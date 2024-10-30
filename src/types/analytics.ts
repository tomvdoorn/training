// Define the exact color type based on our color constants
export type MuscleGroupColor = 
  | "#FF6B6B" 
  | "#4ECDC4" 
  | "#45B7D1" 
  | "#96CEB4" 
  | "#FFEEAD" 
  | "#D4A5A5" 
  | "#9B59B6" 
  | "#3498DB" 
  | "#E67E22" 
  | "#2ECC71";

export interface WeeklyVolumeData {
  date: string
  volume: number
}

export interface MuscleGroupData {
  name: string
  value: number
  color: MuscleGroupColor
}

export interface WorkoutDistributionData {
  day: string
  count: number
}

export interface PersonalRecordData {
  exercise: string
  value: number
  type: string
  date: string
}

export interface AnalyticsStats {
  totalWorkouts: number
  workoutsThisWeek: number
  totalWeight: number
  weeklyVolume: WeeklyVolumeData[]
  muscleGroups: MuscleGroupData[]
  workoutsByDay: WorkoutDistributionData[]
  recentPRs: PersonalRecordData[]
  totalPRs: number
  prsThisMonth: number
}

// Export the color type and constants for use in other files
export const MUSCLE_GROUP_COLORS: Record<string, MuscleGroupColor> = {
  Legs: '#FF6B6B',
  Chest: '#4ECDC4',
  Back: '#45B7D1',
  Shoulders: '#96CEB4',
  Hamstrings: '#FFEEAD',
  Calves: '#D4A5A5',
  Lats: '#9B59B6',
  Triceps: '#3498DB',
  Biceps: '#E67E22',
  Other: '#2ECC71'
} as const; 