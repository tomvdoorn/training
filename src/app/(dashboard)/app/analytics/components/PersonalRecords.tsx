"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy } from "lucide-react"

interface PersonalRecordsProps {
  data?: {
    exercise: string
    value: number
    type: string
    date: string
  }[]
}

export function PersonalRecords({ data }: PersonalRecordsProps) {
  if (!data) return null

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {data.map((record, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{record.exercise}</p>
              <p className="text-xs text-muted-foreground">
                {record.value}
                {record.type === 'weight' ? 'kg' : record.type === 'reps' ? ' reps' : ''}
                {' '} - {record.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 