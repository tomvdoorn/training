import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const exercise = await prisma.exercise.create({
    data: {
      name: 'Bench Press',
      description: 'A basic chest exercise using a barbell.',
      muscleGroup: 'Chest',
      type: 'Free Weight',
      imageUrl: 'https://example.com/bench-press.jpg',
      videoUrl: 'https://example.com/bench-press.mp4',
    },
  });

  console.log('Exercise added:', exercise);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
