"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

interface WorkoutDistributionProps {
  data?: {
    day: string
    count: number
  }[]
}

export function WorkoutDistribution({ data }: WorkoutDistributionProps) {
  if (!data) return null

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="day"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length > 0 && payload[0]?.payload) {
              const data = payload[0].payload as { day: string, value: number }
              return (
                <Card className="p-2">
                  <div className="text-sm font-bold">{data.day}</div>
                  <div className="text-sm">{payload[0].value} workouts</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="count"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 