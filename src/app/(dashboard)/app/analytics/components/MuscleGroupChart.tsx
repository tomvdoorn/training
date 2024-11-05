"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import type { MuscleGroupData } from "~/types/analytics"

interface MuscleGroupChartProps {
  data?: MuscleGroupData[]
}

export function MuscleGroupChart({ data }: MuscleGroupChartProps) {
  if (!data) return null

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry: { name: string }) => entry.name}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length > 0 && payload[0]) {
              const data = payload[0].payload as MuscleGroupData
              return (
                <Card className="p-2">
                  <div className="text-sm font-bold">{data.name}</div>
                  <div className="text-sm">{data.value} exercises</div>
                </Card>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
} 