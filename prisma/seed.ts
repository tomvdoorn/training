import { PrismaClient } from '@prisma/client';
import { MuscleGroup } from '@prisma/client';

const prisma = new PrismaClient();
async function createTemplates() {
  // Helper function for creating sets with warmups
  const createSetsWithWarmups = (workingSets: number, reps: number) => {
    const sets = [
      { reps: reps + 2, type: "Warmup", weight: 0.5 },  // 50% working weight
      { reps: reps + 1, type: "Warmup", weight: 0.7 },  // 70% working weight
    ];
    
    // Add working sets
    for (let i = 0; i < workingSets; i++) {
      sets.push({ reps, type: "Regular", weight: 1.0 }); // 100% working weight
    }
    
    return sets;
  };

  // Push Template
  const pushTemplate = await prisma.template.create({
    data: {
      name: "Push Day",
      userId: "system",
      owner_id: "system",
      exercises: {
        create: [
          {
            exerciseId: 2, // Bench Press
            order: 1,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 4, // Overhead Press
            order: 2,
            sets: { create: createSetsWithWarmups(3, 10) }
          },
          {
            exerciseId: 13, // Close Grip Bench
            order: 3,
            sets: { create: createSetsWithWarmups(3, 12) }
          },
          {
            exerciseId: 16, // Lateral Raises
            order: 4,
            sets: { create: createSetsWithWarmups(3, 15) }
          }
        ]
      }
    }
  });

  // Pull Template
  const pullTemplate = await prisma.template.create({
    data: {
      name: "Pull Day",
      userId: "system",
      owner_id: "system",
      exercises: {
        create: [
          {
            exerciseId: 3, // Deadlift
            order: 1,
            sets: { create: createSetsWithWarmups(3, 6) }
          },
          {
            exerciseId: 5, // Barbell Row
            order: 2,
            sets: { create: createSetsWithWarmups(3, 10) }
          },
          {
            exerciseId: 16, // Barbell Curl
            order: 3,
            sets: { create: createSetsWithWarmups(3, 12) }
          },
          {
            exerciseId: 12, // Face Pulls
            order: 4,
            sets: { create: createSetsWithWarmups(3, 15) }
          }
        ]
      }
    }
  });

  // Legs Template
  const legsTemplate = await prisma.template.create({
    data: {
      name: "Leg Day",
      userId: "system",
      owner_id: "system",
      exercises: {
        create: [
          {
            exerciseId: 1, // Squat
            order: 1,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 6, // Romanian Deadlift
            order: 2,
            sets: { create: createSetsWithWarmups(3, 10) }
          },
          {
            exerciseId: 5, // Leg Press
            order: 3,
            sets: { create: createSetsWithWarmups(3, 12) }
          },
          {
            exerciseId: 9, // Calf Raises
            order: 4,
            sets: { create: createSetsWithWarmups(3, 15) }
          }
        ]
      }
    }
  });

  // Upper Body Template
  const upperTemplate = await prisma.template.create({
    data: {
      name: "Upper Body",
      userId: "system",
      owner_id: "system",
      exercises: {
        create: [
          {
            exerciseId: 2, // Bench Press
            order: 1,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 5, // Barbell Row
            order: 2,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 4, // Overhead Press
            order: 3,
            sets: { create: createSetsWithWarmups(3, 10) }
          },
          {
            exerciseId: 16, // Barbell Curl
            order: 4,
            sets: { create: createSetsWithWarmups(3, 12) }
          },
          {
            exerciseId: 13, // Close Grip Bench
            order: 5,
            sets: { create: createSetsWithWarmups(2, 12) }
          }
        ]
      }
    }
  });

  // Lower Body Template
  const lowerTemplate = await prisma.template.create({
    data: {
      name: "Lower Body",
      userId: "system",
      owner_id: "system",
      exercises: {
        create: [
          {
            exerciseId: 1, // Squat
            order: 1,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 3, // Deadlift
            order: 2,
            sets: { create: createSetsWithWarmups(3, 6) }
          },
          {
            exerciseId: 5, // Leg Press
            order: 3,
            sets: { create: createSetsWithWarmups(3, 12) }
          },
          {
            exerciseId: 6, // Romanian Deadlift
            order: 4,
            sets: { create: createSetsWithWarmups(2, 12) }
          },
          {
            exerciseId: 9, // Calf Raises
            order: 5,
            sets: { create: createSetsWithWarmups(3, 15) }
          }
        ]
      }
    }
  });

  // Full Body Template
  const fullBodyTemplate = await prisma.template.create({
    data: {
      name: "Full Body",
      userId: "system",
      owner_id: "system",
      exercises: {
        create: [
          {
            exerciseId: 1, // Squat
            order: 1,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 2, // Bench Press
            order: 2,
            sets: { create: createSetsWithWarmups(3, 8) }
          },
          {
            exerciseId: 5, // Barbell Row
            order: 3,
            sets: { create: createSetsWithWarmups(3, 10) }
          },
          {
            exerciseId: 4, // Overhead Press
            order: 4,
            sets: { create: createSetsWithWarmups(2, 10) }
          },
          {
            exerciseId: 6, // Romanian Deadlift
            order: 5,
            sets: { create: createSetsWithWarmups(2, 12) }
          },
          {
            exerciseId: 16, // Bicep Curl
            order: 6,
            sets: { create: createSetsWithWarmups(2, 12) }
          }
        ]
      }
    }
  });

  return { 
    pushTemplate, 
    pullTemplate, 
    legsTemplate, 
    upperTemplate, 
    lowerTemplate, 
    fullBodyTemplate 
  };
}

async function createTrainingPlans(templates: any) {
  // 4-day Split (Upper/Lower + Full Body)
  const fourDayPlan = await prisma.trainingPlan.create({
    data: {
      name: "4-Day Strength Focus",
      duration: 7,
      userId: "system",
      owner_id: "system",
      difficulty: "Intermediate",
      templates: {
        create: [
          { templateId: templates.upperTemplate.id, day: 1, userId: "system" },
          { templateId: templates.lowerTemplate.id, day: 2, userId: "system" },
          { day: 3, userId: "system" }, // Rest
          { templateId: templates.fullBodyTemplate.id, day: 4, userId: "system" },
          { templateId: templates.fullBodyTemplate.id, day: 5, userId: "system" },
          { day: 6, userId: "system" }, // Rest
          { day: 7, userId: "system" }  // Rest
        ]
      }
    }
  });

  // 5-day Split (Upper/Lower + PPL)
  const fiveDayPlan = await prisma.trainingPlan.create({
    data: {
      name: "5-Day Hybrid Split",
      duration: 7,
      userId: "system",
      owner_id: "system",
      difficulty: "Advanced",
      templates: {
        create: [
          { templateId: templates.upperTemplate.id, day: 1, userId: "system" },
          { templateId: templates.lowerTemplate.id, day: 2, userId: "system" },
          { day: 3, userId: "system" }, // Rest
          { templateId: templates.pushTemplate.id, day: 4, userId: "system" },
          { templateId: templates.pullTemplate.id, day: 5, userId: "system" },
          { templateId: templates.legsTemplate.id, day: 6, userId: "system" },
          { day: 7, userId: "system" }  // Rest
        ]
      }
    }
  });

  // 6-day PPL (Original PPL twice per week)
  const sixDayPlan = await prisma.trainingPlan.create({
    data: {
      name: "6-Day PPL Split",
      duration: 7,
      userId: "system",
      owner_id: "system",
      difficulty: "Expert",
      templates: {
        create: [
          { templateId: templates.pushTemplate.id, day: 1, userId: "system" },
          { templateId: templates.pullTemplate.id, day: 2, userId: "system" },
          { templateId: templates.legsTemplate.id, day: 3, userId: "system" },
          { templateId: templates.pushTemplate.id, day: 4, userId: "system" },
          { templateId: templates.pullTemplate.id, day: 5, userId: "system" },
          { templateId: templates.legsTemplate.id, day: 6, userId: "system" },
          { day: 7, userId: "system" }  // Rest
        ]
      }
    }
  });

  return {
    fourDayPlan,
    fiveDayPlan,
    sixDayPlan
  };
}

async function createStoreListings(templates: any, trainingPlans: any) {
  // Create store listings for templates
  await prisma.storeListing.create({
    data: {
      title: "Push Day Template",
      description: "A comprehensive push workout focusing on chest, shoulders, and triceps.",
      type: "Template",
      template_id: templates.pushTemplate.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "Pull Day Template",
      description: "A complete pull workout targeting back and biceps development.",
      type: "Template",
      template_id: templates.pullTemplate.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "Leg Day Template",
      description: "A thorough leg workout for building strength and muscle in the lower body.",
      type: "Template",
      template_id: templates.legsTemplate.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "Upper Body Template",
      description: "A balanced upper body workout combining push and pull movements.",
      type: "Template",
      template_id: templates.upperTemplate.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "Lower Body Template",
      description: "A comprehensive lower body session focusing on legs and posterior chain.",
      type: "Template",
      template_id: templates.lowerTemplate.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "Full Body Template",
      description: "An efficient full body workout hitting all major muscle groups.",
      type: "Template",
      template_id: templates.fullBodyTemplate.id,
      status: "Active"
    }
  });

  // Create store listings for training plans
  await prisma.storeListing.create({
    data: {
      title: "4-Day Strength Focus Program",
      description: "A balanced 4-day program combining upper/lower splits with full body workouts. Perfect for intermediate lifters looking to build strength and muscle.",
      type: "TrainingPlan",
      training_plan_id: trainingPlans.fourDayPlan.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "5-Day Hybrid Split",
      description: "An advanced 5-day program combining upper/lower and PPL training styles for maximum gains.",
      type: "TrainingPlan",
      training_plan_id: trainingPlans.fiveDayPlan.id,
      status: "Active"
    }
  });

  await prisma.storeListing.create({
    data: {
      title: "6-Day PPL Split",
      description: "An intense 6-day Push/Pull/Legs program for experienced lifters seeking maximum volume and frequency.",
      type: "TrainingPlan",
      training_plan_id: trainingPlans.sixDayPlan.id,
      status: "Active"
    }
  });
}

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
    // Barbell Exercises (typeId: 1)
    { name: 'Barbell Squat', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the lower body muscles.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Pause Squat', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the lower body muscles.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Bench Press', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the chest muscles.', muscleGroup: MuscleGroup.Chest },
    { name: 'Barbell Deadlift', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the entire posterior chain.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell Overhead Press', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the shoulders.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Barbell Row', categoryId: 1, typeId: 1, description: 'A compound exercise that targets the back muscles.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell Romanian Deadlift', categoryId: 1, typeId: 1, description: 'A hip-hinge movement targeting hamstrings and lower back.', muscleGroup: MuscleGroup.Hamstrings },
    { name: 'Barbell Front Squat', categoryId: 1, typeId: 1, description: 'A squat variation emphasizing quad development and core strength.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Good Morning', categoryId: 1, typeId: 1, description: 'A hip-hinge movement for posterior chain development.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell Calf Raise', categoryId: 1, typeId: 1, description: 'Standing calf raise with barbell.', muscleGroup: MuscleGroup.Calves },
    { name: 'Barbell Hip Thrust', categoryId: 1, typeId: 1, description: 'A glute-focused exercise performed with a barbell.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Lunges', categoryId: 1, typeId: 1, description: 'A unilateral leg exercise with barbell.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Shrugs', categoryId: 1, typeId: 1, description: 'An isolation exercise for trapezius development.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell Close Grip Bench Press', categoryId: 1, typeId: 1, description: 'A tricep-focused variation of the bench press.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Barbell Incline Bench Press', categoryId: 1, typeId: 1, description: 'An upper chest focused pressing movement.', muscleGroup: MuscleGroup.Chest },    
    { name: 'Barbell Decline Bench Press', categoryId: 1, typeId: 1, description: 'A lower chest focused pressing movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Barbell Curl', categoryId: 1, typeId: 1, description: 'A standing bicep exercise with barbell.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Barbell Zercher Squat', categoryId: 1, typeId: 1, description: 'A squat variation with the barbell held in the crooks of the elbows.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Power Clean', categoryId: 1, typeId: 1, description: 'An explosive Olympic lifting movement.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell Rack Pull', categoryId: 1, typeId: 1, description: 'A partial deadlift movement from elevated starting position.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell Box Squat', categoryId: 1, typeId: 1, description: 'A squat variation performed to a box.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Shrug', categoryId: 1, typeId: 1, description: 'An isolation exercise for trapezius development.', muscleGroup: MuscleGroup.Back },
    { name: 'Barbell RDL', categoryId: 1, typeId: 1, description: 'A hip-hinge movement targeting hamstrings and lower back.', muscleGroup: MuscleGroup.Hamstrings },
    { name: 'Barbell Larsen Press', categoryId: 1, typeId: 1, description: 'A Bench press variation with the barbell held in the crooks of the elbows.', muscleGroup: MuscleGroup.Legs },
    { name: 'Barbell Preacher Curl', categoryId: 1, typeId: 1, description: 'An isolation exercise for biceps development.', muscleGroup: MuscleGroup.Biceps },

    
    // Dumbbell Exercises (typeId: 2)
    { name: 'Dumbbell Curl', categoryId: 1, typeId: 2, description: 'An isolation exercise for biceps development.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Dumbbell Hammer Curl', categoryId: 1, typeId: 2, description: 'A bicep curl variation targeting the brachialis.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Dumbbell Incline Curl', categoryId: 1, typeId: 2, description: 'A bicep curl performed on an incline bench.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Dumbbell Concentration Curl', categoryId: 1, typeId: 2, description: 'A seated isolation exercise for biceps.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Dumbbell Lateral Raise', categoryId: 1, typeId: 2, description: 'An isolation exercise for lateral deltoid development.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Dumbbell Front Raise', categoryId: 1, typeId: 2, description: 'An isolation exercise for anterior deltoids.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Dumbbell Bent Over Lateral Raise', categoryId: 1, typeId: 2, description: 'An isolation exercise for posterior deltoids.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Dumbbell Arnold Press', categoryId: 1, typeId: 2, description: 'A shoulder press variation with rotation.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Dumbbell Shoulder Press', categoryId: 1, typeId: 2, description: 'A compound exercise for shoulder development.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Dumbbell Single Arm Row', categoryId: 1, typeId: 2, description: 'A unilateral back exercise.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Bent Over Row', categoryId: 1, typeId: 2, description: 'A compound exercise for back development.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Renegade Row', categoryId: 1, typeId: 2, description: 'A plank position row targeting core and back.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Flat Bench Press', categoryId: 1, typeId: 2, description: 'A chest pressing movement with dumbbells.', muscleGroup: MuscleGroup.Chest },
    { name: 'Dumbbell Incline Bench Press', categoryId: 1, typeId: 2, description: 'An upper chest focused pressing movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Dumbbell Decline Bench Press', categoryId: 1, typeId: 2, description: 'A lower chest focused pressing movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Dumbbell Flat Chest Fly', categoryId: 1, typeId: 2, description: 'An isolation exercise for chest muscles.', muscleGroup: MuscleGroup.Chest },
    { name: 'Dumbbell Incline Chest Fly', categoryId: 1, typeId: 2, description: 'An upper chest focused fly movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Dumbbell Overhead Tricep Extension', categoryId: 1, typeId: 2, description: 'An isolation exercise for triceps.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Dumbbell Lying Tricep Extension', categoryId: 1, typeId: 2, description: 'A supine tricep isolation exercise.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Dumbbell Single Arm Tricep Extension', categoryId: 1, typeId: 2, description: 'A unilateral tricep exercise.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Dumbbell Romanian Deadlift', categoryId: 1, typeId: 2, description: 'A hip-hinge movement with dumbbells.', muscleGroup: MuscleGroup.Hamstrings },
    { name: 'Dumbbell Goblet Squat', categoryId: 1, typeId: 2, description: 'A front-loaded squat variation.', muscleGroup: MuscleGroup.Legs },
    { name: 'Dumbbell Bulgarian Split Squat', categoryId: 1, typeId: 2, description: 'A unilateral leg exercise.', muscleGroup: MuscleGroup.Legs },
    { name: 'Dumbbell Walking Lunges', categoryId: 1, typeId: 2, description: 'A dynamic lower body exercise.', muscleGroup: MuscleGroup.Legs },
    { name: 'Dumbbell Step Ups', categoryId: 1, typeId: 2, description: 'A unilateral leg exercise using elevation.', muscleGroup: MuscleGroup.Legs },
    { name: 'Dumbbell Calf Raises', categoryId: 1, typeId: 2, description: 'An isolation exercise for calf development.', muscleGroup: MuscleGroup.Calves },
    { name: 'Dumbbell Farmers Walk', categoryId: 1, typeId: 2, description: 'A full body carrying exercise.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Shrugs', categoryId: 1, typeId: 2, description: 'An isolation exercise for trapezius muscles.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Pullovers', categoryId: 1, typeId: 2, description: 'A compound movement for chest and lats.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Reverse Fly', categoryId: 1, typeId: 2, description: 'An isolation exercise for rear deltoids.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Dumbbell Clean', categoryId: 1, typeId: 2, description: 'An explosive full body movement.', muscleGroup: MuscleGroup.Legs },
    { name: 'Dumbbell Snatch', categoryId: 1, typeId: 2, description: 'A complex full body movement.', muscleGroup: MuscleGroup.Legs },
    { name: 'Dumbbell Cross Body Hammer Curl', categoryId: 1, typeId: 2, description: 'A bicep curl variation with cross-body motion.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Dumbbell Zottman Curl', categoryId: 1, typeId: 2, description: 'A complex curl targeting multiple forearm muscles.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Dumbbell Around The World', categoryId: 1, typeId: 2, description: 'A circular movement pattern for chest.', muscleGroup: MuscleGroup.Chest },
    { name: 'Dumbbell Shrug', categoryId: 1, typeId: 2, description: 'An isolation exercise for trapezius muscles.', muscleGroup: MuscleGroup.Back },
    { name: 'Dumbbell Preacher Curl', categoryId: 1, typeId: 1, description: 'An isolation exercise for biceps development.', muscleGroup: MuscleGroup.Biceps },
    // Machine Exercises (typeId: 3)
    { name: 'Machine Leg Press', categoryId: 1, typeId: 3, description: 'A machine-based lower body press.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Chest Press', categoryId: 1, typeId: 3, description: 'A machine-based chest press movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Machine Lat Pulldown', categoryId: 1, typeId: 3, description: 'A machine-based vertical pulling movement.', muscleGroup: MuscleGroup.Lats },
    { name: 'Machine Seated Row', categoryId: 1, typeId: 3, description: 'A machine-based horizontal pulling movement.', muscleGroup: MuscleGroup.Back },
    { name: 'Machine Leg Extension', categoryId: 1, typeId: 3, description: 'An isolation exercise for quadriceps.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Laying Leg Curl', categoryId: 1, typeId: 3, description: 'An isolation exercise for hamstrings.', muscleGroup: MuscleGroup.Hamstrings },
    { name: 'Machine Seated Leg Curl', categoryId: 1, typeId: 3, description: 'A seated variation of leg curl.', muscleGroup: MuscleGroup.Hamstrings },
    { name: 'Smith Machine Squat', categoryId: 1, typeId: 3, description: 'A guided barbell squat movement.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Pec Deck', categoryId: 1, typeId: 3, description: 'An isolation exercise for chest muscles.', muscleGroup: MuscleGroup.Chest },
    { name: 'Machine Shoulder Press', categoryId: 1, typeId: 3, description: 'A machine-based overhead press.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Machine Calf Raise', categoryId: 1, typeId: 3, description: 'An isolation exercise for calf muscles.', muscleGroup: MuscleGroup.Calves },
    { name: 'Machine Hip Abductor', categoryId: 1, typeId: 3, description: 'An isolation exercise for hip abductors.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Hip Adductor', categoryId: 1, typeId: 3, description: 'An isolation exercise for hip adductors.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Back Extension', categoryId: 1, typeId: 3, description: 'A machine for lower back development.', muscleGroup: MuscleGroup.Back },
    { name: 'Machine Tricep Extension', categoryId: 1, typeId: 3, description: 'An isolation exercise for triceps.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Machine Bicep Curl', categoryId: 1, typeId: 3, description: 'An isolation exercise for biceps.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Machine Hack Squat', categoryId: 1, typeId: 3, description: 'A machine-based squat variation.', muscleGroup: MuscleGroup.Legs },
    { name: 'Smith Machine Bench Press', categoryId: 1, typeId: 3, description: 'A guided barbell bench press.', muscleGroup: MuscleGroup.Chest },
    { name: 'Machine Seated Calf Raise', categoryId: 1, typeId: 3, description: 'A seated variation of machine calf raise.', muscleGroup: MuscleGroup.Calves },
    { name: 'Machine T-Bar Row', categoryId: 1, typeId: 3, description: 'A machine-based rowing movement.', muscleGroup: MuscleGroup.Back },
    { name: 'Machine Reverse Pec Deck', categoryId: 1, typeId: 3, description: 'A machine exercise for rear deltoids.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Machine Vertical Leg Press', categoryId: 1, typeId: 3, description: 'A vertical variation of the leg press.', muscleGroup: MuscleGroup.Legs },
    { name: 'Smith Machine Shoulder Press', categoryId: 1, typeId: 3, description: 'A guided overhead press movement.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Machine Iso-Lateral Row', categoryId: 1, typeId: 3, description: 'An independent arm rowing machine.', muscleGroup: MuscleGroup.Back },
    { name: 'Machine Iso-Lateral Chest Press', categoryId: 1, typeId: 3, description: 'An independent arm chest press.', muscleGroup: MuscleGroup.Chest },
    { name: 'Machine Pendulum Squat', categoryId: 1, typeId: 3, description: 'A machine-based squat with unique mechanics.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Glute Drive', categoryId: 1, typeId: 3, description: 'A machine targeting glute development.', muscleGroup: MuscleGroup.Glutes },
    { name: 'Machine Belt Squat', categoryId: 1, typeId: 3, description: 'A belt-loaded squat variation.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Plate Loaded Chest Supported Row', categoryId: 1, typeId: 3, description: 'A chest supported rowing machine.', muscleGroup: MuscleGroup.Back },
    { name: 'Machine Leverage Deadlift', categoryId: 1, typeId: 3, description: 'A machine-based deadlift movement.', muscleGroup: MuscleGroup.Back },
    { name: 'Machine Seated Leg Press', categoryId: 1, typeId: 3, description: 'A seated variation of leg press.', muscleGroup: MuscleGroup.Legs },
    { name: 'Machine Rotary Torso', categoryId: 1, typeId: 3, description: 'A machine for oblique and core training.', muscleGroup: MuscleGroup.Core },
    { name: 'Machine Abdominal Crunch', categoryId: 1, typeId: 3, description: 'A machine for targeted ab training.', muscleGroup: MuscleGroup.Core },
    { name: 'Machine Seated Dip', categoryId: 1, typeId: 3, description: 'A machine-based dip movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Machine Plate Loaded Shoulder Press', categoryId: 1, typeId: 3, description: 'A plate-loaded overhead press machine.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Machine Kneeling Leg Curl', categoryId: 1, typeId: 3, description: 'A kneeling variation of leg curl.', muscleGroup: MuscleGroup.Hamstrings },
    { name: 'Machine Standing Calf Press', categoryId: 1, typeId: 3, description: 'A standing machine for calf development.', muscleGroup: MuscleGroup.Calves },
    { name: 'Machine Converging Chest Press', categoryId: 1, typeId: 3, description: 'A chest press with converging movement pattern.', muscleGroup: MuscleGroup.Chest },
    { name: 'Machine Diverging Lat Pulldown', categoryId: 1, typeId: 3, description: 'A lat pulldown with diverging movement pattern.', muscleGroup: MuscleGroup.Back },
    // Cable Exercises (typeId: 4)
    { name: 'Cable Tricep Pushdown', categoryId: 1, typeId: 4, description: 'An isolation exercise for triceps.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Cable Single Arm Tricep Extension', categoryId: 1, typeId: 4, description: 'A unilateral tricep exercise.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Cable Single Arm Tricep Press Down', categoryId: 1, typeId: 4, description: 'An isolation exercise for triceps.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Cable Face Pull', categoryId: 1, typeId: 4, description: 'A rear deltoid and upper back exercise.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Cable Row', categoryId: 1, typeId: 4, description: 'A cable-based back exercise.', muscleGroup: MuscleGroup.Back },
    { name: 'Cable Curl', categoryId: 1, typeId: 4, description: 'An isolation exercise for biceps.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Cable Lateral Raise', categoryId: 1, typeId: 4, description: 'An isolation exercise for shoulders.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Cable Woodchop', categoryId: 1, typeId: 4, description: 'A rotational core exercise using cables.', muscleGroup: MuscleGroup.Core },
    { name: 'Cable Chest Fly', categoryId: 1, typeId: 4, description: 'An isolation exercise for chest muscles.', muscleGroup: MuscleGroup.Chest },
    { name: 'Cable Pullover', categoryId: 1, typeId: 4, description: 'A lat and serratus exercise using cables.', muscleGroup: MuscleGroup.Back },
    { name: 'Cable Upright Row', categoryId: 1, typeId: 4, description: 'A shoulder and trap exercise using cables.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Cable Crunch', categoryId: 1, typeId: 4, description: 'An abdominal exercise using cables.', muscleGroup: MuscleGroup.Core },
    { name: 'Cable Kickback', categoryId: 1, typeId: 4, description: 'An isolation exercise for triceps.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Cable Pull Through', categoryId: 1, typeId: 4, description: 'A hip-hinge movement using cables.', muscleGroup: MuscleGroup.Glutes },
    { name: 'Standing Cable Rotation', categoryId: 1, typeId: 4, description: 'A standing rotational core exercise.', muscleGroup: MuscleGroup.Core },
    { name: 'Cable Front Raise', categoryId: 1, typeId: 4, description: 'An anterior deltoid exercise using cables.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Low Cable Cross-over', categoryId: 1, typeId: 4, description: 'A lower chest focused cable exercise.', muscleGroup: MuscleGroup.Chest },
    { name: 'High Cable Cross-over', categoryId: 1, typeId: 4, description: 'An upper chest focused cable exercise.', muscleGroup: MuscleGroup.Chest },
    { name: 'Cable External Rotation', categoryId: 1, typeId: 4, description: 'A rotator cuff exercise using cables.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Cable Internal Rotation', categoryId: 1, typeId: 4, description: 'A rotator cuff exercise using cables.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Straight Arm Cable Pulldown', categoryId: 1, typeId: 4, description: 'A lat isolation exercise using cables.', muscleGroup: MuscleGroup.Back },
    { name: 'Cable Hip Abduction', categoryId: 1, typeId: 4, description: 'A hip abductor exercise using cables.', muscleGroup: MuscleGroup.Legs },
    { name: 'Single Arm Cable Row', categoryId: 1, typeId: 4, description: 'Unilateral back exercise using cables.', muscleGroup: MuscleGroup.Back },
    { name: 'Rope Hammer Curl', categoryId: 1, typeId: 4, description: 'Biceps exercise using rope attachment.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Cable Reverse Fly', categoryId: 1, typeId: 4, description: 'Rear deltoid isolation exercise.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Standing Cable Calf Raise', categoryId: 1, typeId: 4, description: 'Calf exercise using cables.', muscleGroup: MuscleGroup.Calves },
    { name: 'Cable Shrug', categoryId: 1, typeId: 4, description: 'Trapezius exercise using cables.', muscleGroup: MuscleGroup.Back },
    { name: 'Single Arm Tricep Extension', categoryId: 1, typeId: 4, description: 'Unilateral tricep exercise.', muscleGroup: MuscleGroup.Triceps },
    { name: 'Kneeling Cable Crunch', categoryId: 1, typeId: 4, description: 'Targeted abdominal exercise.', muscleGroup: MuscleGroup.Back },
    { name: 'Cable Side Bend', categoryId: 1, typeId: 4, description: 'Oblique exercise using cables.', muscleGroup: MuscleGroup.Back },
    { name: 'Single Arm Cable Front Raise', categoryId: 1, typeId: 4, description: 'Unilateral shoulder exercise.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Cable Concentration Curl', categoryId: 1, typeId: 4, description: 'Isolated bicep exercise using cables.', muscleGroup: MuscleGroup.Biceps },
    { name: 'Cross-Body Cable Y-Raise (Side Delt)', categoryId: 1, typeId: 4, description: 'Side delt exercise using cables.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Cable Bayesian Curl', categoryId: 1, typeId: 4, description: 'Bicep curl variation using cables. Lean forward curl arm from behind the back ', muscleGroup: MuscleGroup.Biceps },
    { name: 'Cable Seated Row', categoryId: 1, typeId: 4, description: 'Horizontal pulling movement using cables.', muscleGroup: MuscleGroup.Back },
    
    // Weighted Bodyweight Exercises (typeId: 5)
    { name: 'Weighted Pull Up', categoryId: 1, typeId: 5, description: 'Pull up with added weight.', muscleGroup: MuscleGroup.Back },
    { name: 'Weighted Dip', categoryId: 1, typeId: 5, description: 'Dip with added weight.', muscleGroup: MuscleGroup.Chest },
    { name: 'Weighted Push Up', categoryId: 1, typeId: 5, description: 'Push up with added weight.', muscleGroup: MuscleGroup.Chest },
    
    // Assisted Bodyweight Exercises (typeId: 6)
    { name: 'Assisted Pull Up', categoryId: 1, typeId: 6, description: 'Pull up with assistance.', muscleGroup: MuscleGroup.Back },
    { name: 'Assisted Dip', categoryId: 1, typeId: 6, description: 'Dip with assistance.', muscleGroup: MuscleGroup.Chest },
    { name: 'Band-Assisted Push Up', categoryId: 1, typeId: 6, description: 'Push up with band assistance.', muscleGroup: MuscleGroup.Chest },
    
    // Repetition Exercises (typeId: 7)
    { name: 'Bodyweight Push Up', categoryId: 1, typeId: 7, description: 'Basic push up movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Bodyweight Squat', categoryId: 1, typeId: 7, description: 'Basic squat movement.', muscleGroup: MuscleGroup.Legs },
    { name: 'Bodyweight Pull Up', categoryId: 1, typeId: 7, description: 'Basic pull up movement.', muscleGroup: MuscleGroup.Back },
    { name: 'Bodyweight Dip', categoryId: 1, typeId: 7, description: 'Basic dip movement.', muscleGroup: MuscleGroup.Chest },
    { name: 'Bodyweight Inverted Row', categoryId: 1, typeId: 7, description: 'Basic horizontal pulling movement.', muscleGroup: MuscleGroup.Back },
    { name: 'Bodyweight Pike Push Up', categoryId: 1, typeId: 7, description: 'Vertical pushing movement targeting shoulders.', muscleGroup: MuscleGroup.Shoulders },
    { name: 'Bodyweight Chin Up', categoryId: 1, typeId: 7, description: 'Underhand grip pull up variation.', muscleGroup: MuscleGroup.Back },
    { name: 'Bodyweight Diamond Push Up', categoryId: 1, typeId: 7, description: 'Close grip push up variation.', muscleGroup: MuscleGroup.Chest },
    { name: 'Bodyweight Plank', categoryId: 1, typeId: 7, description: 'Static core exercise.', muscleGroup: MuscleGroup.Core },
    { name: 'Bodyweight Mountain Climber', categoryId: 1, typeId: 7, description: 'Dynamic core exercise.', muscleGroup: MuscleGroup.Core },
    { name: 'Bodyweight Burpee', categoryId: 1, typeId: 7, description: 'Full body conditioning exercise.', muscleGroup: MuscleGroup.Legs },
    { name: 'Bodyweight Jumping Jack', categoryId: 1, typeId: 7, description: 'Basic cardio movement.', muscleGroup: MuscleGroup.Legs },
    { name: 'Bodyweight Glute Bridge', categoryId: 1, typeId: 7, description: 'Hip extension exercise.', muscleGroup: MuscleGroup.Glutes },
    { name: 'Bodyweight Calf Raise', categoryId: 1, typeId: 7, description: 'Standing calf exercise.', muscleGroup: MuscleGroup.Calves },
    { name: 'Bodyweight Leg Raise', categoryId: 1, typeId: 7, description: 'Lower ab exercise.', muscleGroup: MuscleGroup.Core }


  ];

  for (const exercise of exercises) {
    console.log(exercise.name)
    await prisma.exercise.create({
      data: exercise,
    });
  }

  const systemUser = await prisma.user.create({
    data: {
      id: "system",
      firstName: "System",
      lastName: "User",
      email: "system@example.com",
    }
  });

  const templates = await createTemplates();
  const trainingPlans = await createTrainingPlans(templates);
  await createStoreListings(templates, trainingPlans);

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
