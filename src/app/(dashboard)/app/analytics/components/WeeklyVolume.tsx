"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

interface WeeklyVolumeProps {
  data?: {
    date: string
    volume: number
  }[]
}

export function WeeklyVolume({ data }: WeeklyVolumeProps) {
  if (!data) return null

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="date"
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
          tickFormatter={(value) => `${value}kg`}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length > 0 && payload[0]?.payload) {
              return (
                <Card className="p-2">
                  <div className="text-sm font-bold">{payload[0].payload.date}</div>
                  <div className="text-sm">{payload[0].value}kg total volume</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="volume"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 