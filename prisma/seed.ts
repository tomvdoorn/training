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

  const types = [
    { name: 'Barbell' },
    { name: 'Dumbbell' },
    { name: 'Machine' },
    { name: 'Cable' },
    { name: 'Weighted Bodyweight' },
    { name: 'Assisted Bodyweight' },
    { name: 'Repetitions' },
    { name: 'Time' },
    { name: 'Cardio' },
    { name: 'Flexibility' },
    { name: 'Balance' },
    { name: 'Other' }
  ];

  for (const category of categories) {
    await prisma.exerciseCategory.create({
      data: category,
    });
  }

  for (const type of types) {
    await prisma.exerciseType.create({
      data: type,
    });
  }

  const exercises = [
    { name: 'Squat', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the lower body muscles.', muscleGroup: MuscleGroup.Legs },
    { name: 'Bench Press', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the chest muscles.', muscleGroup: MuscleGroup.Chest },
    { name: 'Deadlift', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the entire posterior chain.', muscleGroup: MuscleGroup.Back },
    { name: 'Overhead Press', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the shoulders.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Barbell Row', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the back muscles.', muscleGroup: MuscleGroup.Back },
    // Add more exercises here...
  ];

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    });
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
