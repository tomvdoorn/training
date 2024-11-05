import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { addDays, startOfWeek, endOfWeek, format, startOfMonth } from "date-fns"
import { MUSCLE_GROUP_COLORS, type MuscleGroupData } from "~/types/analytics"

export const analyticsRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const now = new Date()
    const startOfThisWeek = startOfWeek(now)
    const endOfThisWeek = endOfWeek(now)

    // Get total workouts
    const totalWorkouts = await ctx.db.trainingSession.count({
      where: { userId }
    })

    // Get workouts this week
    const workoutsThisWeek = await ctx.db.trainingSession.count({
      where: {
        userId,
        startTime: {
          gte: startOfThisWeek,
          lte: endOfThisWeek
        }
      }
    })

    // Calculate total weight lifted (last 30 days)
    const thirtyDaysAgo = addDays(now, -30)
    const sessions = await ctx.db.trainingSession.findMany({
      where: {
        userId,
        startTime: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    })

    const totalWeight = sessions.reduce((acc, session) => {
      return acc + session.exercises.reduce((exerciseAcc, exercise) => {
        return exerciseAcc + exercise.sets.reduce((setAcc, set) => {
          return setAcc + (set.weight ?? 0) * (set.reps ?? 0)
        }, 0)
      }, 0)
    }, 0)

    // Get weekly volume data
    const weeklyVolume = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const date = addDays(startOfThisWeek, i)
        const dayVolume = await ctx.db.sessionExerciseSet.findMany({
          where: {
            sessionExercise: {
              session: {
                userId,
                startTime: {
                  gte: date,
                  lt: addDays(date, 1)
                }
              }
            }
          }
        })

        return {
          date: format(date, 'EEE'),
          volume: dayVolume.reduce((acc, set) => {
            return acc + (set.weight ?? 0) * (set.reps ?? 0)
          }, 0)
        }
      })
    )

    // Get muscle group distribution
    const muscleGroups = await ctx.db.sessionExercise.groupBy({
      by: ['exerciseId'],
      where: { 
        session: { 
          userId 
        } 
      },
      _count: true,
      orderBy: {
        _count: {
          exerciseId: 'desc'
        }
      }
    });

    // Transform the data for the chart with guaranteed colors
    const muscleGroupsData = await Promise.all(
      muscleGroups.map(async (group) => {
        const exercise = await ctx.db.exercise.findUnique({
          where: { id: group.exerciseId },
          include: {
            category: true
          }
        });
        
        const muscleGroup = exercise?.muscleGroup ?? 'Other';
        const color = MUSCLE_GROUP_COLORS[muscleGroup as keyof typeof MUSCLE_GROUP_COLORS] ?? MUSCLE_GROUP_COLORS.Other;
        
        return {
          name: exercise?.name ?? 'Unknown',
          value: group._count,
          color: color!
        } satisfies MuscleGroupData;
      })
    );

    // Get workout distribution by day
    const workoutsByDay = await Promise.all(
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(async (day, index) => {
        const count = await ctx.db.trainingSession.count({
          where: {
            userId,
            startTime: {
              gte: thirtyDaysAgo,
              equals: new Date(now.setDate(now.getDate() - now.getDay() + index))
            }
          }
        });
        return { day, count };
      })
    );

    // Get recent PRs
    const recentPRs = await ctx.db.exercisePersonalRecord.findMany({
      where: {
        userId: ctx.session.user.id
      },
      orderBy: {
        date: 'desc'
      },
      take: 5,
      include: {
        exercise: true
      }
    });

    const formattedPRs = recentPRs.map(pr => ({
      exercise: pr.exercise.name,
      value: pr.value,
      type: pr.prType.toLowerCase(),
      date: format(pr.date, 'MMM d, yyyy')
    }));

    return {
      totalWorkouts,
      workoutsThisWeek,
      totalWeight,
      weeklyVolume,
      muscleGroups: muscleGroupsData,
      workoutsByDay,
      recentPRs: formattedPRs,
      totalPRs: recentPRs.length,
      prsThisMonth: recentPRs.filter(pr => 
        pr.date >= startOfMonth(new Date())
      ).length
    };
  })
})