import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Lifting' },
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
