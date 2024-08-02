import { PrismaClient } from '@prisma/client';
import { MuscleGroup } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Strength' },
    { name: 'Running' },
    { name: 'Yoga' },
    { name: 'Cycling' },
    { name: 'Swimming' },
    { name: 'Pilates' },
  ];

  for (const category of categories) {
    await prisma.exerciseCategory.create({
      data: category,
    });
  }

  const exercises = [
  { name: 'Squat', categoryId: 1, description: 'A compound exercise that targets the lower body muscles.', muscleGroup: MuscleGroup.Legs, type: 'Compound', userId: null },
  { name: 'Bench Press', categoryId: 1, description: 'A compound exercise that targets the chest muscles.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Deadlift', categoryId: 1, description: 'A compound exercise that targets the entire posterior chain.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Overhead Press', categoryId: 1, description: 'A compound exercise that targets the shoulders.', muscleGroup: MuscleGroup.Shoulders, type: 'Compound', userId: null },
  { name: 'Barbell Row', categoryId: 1, description: 'A compound exercise that targets the back muscles.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Dumbbell Flyes', categoryId: 2, description: 'An isolation exercise for the chest muscles, emphasizing the stretch at the bottom.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
  { name: 'Incline Dumbbell Flyes', categoryId: 2, description: 'An isolation exercise targeting the upper chest muscles.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
  { name: 'Romanian Deadlift', categoryId: 2, description: 'A compound exercise focusing on the hamstring stretch.', muscleGroup: MuscleGroup.Legs, type: 'Compound', userId: null },
  { name: 'Chest Dips', categoryId: 2, description: 'A compound exercise for the chest muscles.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Pull-Over', categoryId: 2, description: 'An isolation exercise for the chest and lats.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
  { name: 'Bulgarian Split Squat', categoryId: 2, description: 'A single-leg exercise targeting the legs.', muscleGroup: MuscleGroup.Legs, type: 'Compound', userId: null },
  { name: 'Seated Leg Curl', categoryId: 2, description: 'An isolation exercise for the hamstrings.', muscleGroup: MuscleGroup.Legs, type: 'Isolation', userId: null },
  { name: 'Incline Bench Press', categoryId: 2, description: 'A compound exercise for the upper chest.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Standing Calf Raise', categoryId: 2, description: 'An isolation exercise for the calves.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
  { name: 'Seated Calf Raise', categoryId: 2, description: 'An isolation exercise for the calves.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
  { name: 'Lat Pulldown', categoryId: 2, description: 'A compound exercise for the lats.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Seated Cable Row', categoryId: 2, description: 'A compound exercise for the back muscles.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Triceps Overhead Extension', categoryId: 2, description: 'An isolation exercise for the triceps.', muscleGroup: MuscleGroup.Triceps, type: 'Isolation', userId: null },
  { name: 'Leg Press', categoryId: 2, description: 'A compound exercise for the legs.', muscleGroup: MuscleGroup.Legs, type: 'Compound', userId: null },
  { name: 'Hip Thrust', categoryId: 2, description: 'A compound exercise for the glutes.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Machine Chest Press', categoryId: 2, description: 'A compound exercise for the chest muscles.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Lying Leg Curl', categoryId: 2, description: 'An isolation exercise for the hamstrings.', muscleGroup: MuscleGroup.Legs, type: 'Isolation', userId: null },
  { name: 'Cable Chest Fly', categoryId: 2, description: 'An isolation exercise for the chest.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
  { name: 'Standing Dumbbell Curl', categoryId: 2, description: 'An isolation exercise for the biceps.', muscleGroup: MuscleGroup.Biceps, type: 'Isolation', userId: null },
  { name: 'Preacher Curl', categoryId: 2, description: 'An isolation exercise for the biceps.', muscleGroup: MuscleGroup.Biceps, type: 'Isolation', userId: null },
  { name: 'Pull-Up', categoryId: 3, description: 'A compound exercise for the back and biceps.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Chin-Up', categoryId: 3, description: 'A compound exercise for the back and biceps.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Leg Extension', categoryId: 3, description: 'An isolation exercise for the legs.', muscleGroup: MuscleGroup.Legs, type: 'Isolation', userId: null },
  { name: 'Good Mornings', categoryId: 3, description: 'A compound exercise for the back and hamstrings.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Front Squat', categoryId: 3, description: 'A compound exercise for the legs.', muscleGroup: MuscleGroup.Legs, type: 'Compound', userId: null },
  { name: 'Hack Squat', categoryId: 3, description: 'A compound exercise for the legs.', muscleGroup: MuscleGroup.Legs, type: 'Compound', userId: null },
  { name: 'Snatch Grip Deadlift', categoryId: 3, description: 'A compound exercise for the entire posterior chain.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Pendlay Row', categoryId: 3, description: 'A compound exercise for the back muscles.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Bent Over Dumbbell Row', categoryId: 3, description: 'A compound exercise for the back muscles.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'T-Bar Row', categoryId: 3, description: 'A compound exercise for the back muscles.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Single Arm Dumbbell Row', categoryId: 3, description: 'A compound exercise for the back muscles.', muscleGroup: MuscleGroup.Back, type: 'Compound', userId: null },
  { name: 'Dumbbell Bench Press', categoryId: 3, description: 'A compound exercise for the chest muscles.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Incline Dumbbell Bench Press', categoryId: 3, description: 'A compound exercise for the upper chest.', muscleGroup: MuscleGroup.Chest, type: 'Compound', userId: null },
  { name: 'Pec Deck Machine', categoryId: 3, description: 'An isolation exercise for the chest muscles.', muscleGroup: MuscleGroup.Chest, type: 'Isolation', userId: null },
]


  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    })
  }
    console.log('Seed data created successfully');

}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
