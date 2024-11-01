// src/components/app/workouts/WorkoutPageContent.tsx
"use client"

import AllTemplatesUser from "~/components/app/workouts/AllTemplatesUsers"
import AddTemplateButton from "~/components/app/workouts/AddTemplateButton"
import TrainingPlans from "~/components/app/workouts/TrainingPlans"

interface WorkoutPageContentProps {
  userId: string
}

export default function WorkoutPageContent({ userId }: WorkoutPageContentProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
        </div>
        <AllTemplatesUser user_id={userId} />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Training Plans</h2>
          <AddTemplateButton />
        </div>
        <div className="border-b border-gray-200 mb-4"></div>
        <TrainingPlans userId={userId} />
      </div>
    </div>
  )
}
