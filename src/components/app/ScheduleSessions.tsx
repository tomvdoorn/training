import React, { useState } from 'react'
import { useSchedulingStore } from '@/stores/schedulingStore'
import { api as trpc } from "~/trpc/react"
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Label } from "@/components/ui/label"

const ScheduleSession = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const now = new Date()
  now.setMinutes(Math.round(now.getMinutes() / 15) * 15)
  now.setSeconds(0)
  const [selectedTime, setSelectedTime] = useState<string>(
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  )
  const { selectedDate, selectedTemplateId, setSelectedDate, setSelectedTemplateId, resetState } = useSchedulingStore()
  const scheduleSessionMutation = trpc.session.scheduleSession.useMutation()
  const templatesQuery = trpc.template.getTemplatesUser.useQuery()
  const utils = trpc.useContext()

  const handleSchedule = async () => {
    if (selectedDate && selectedTemplateId) {
      try {
        const [hours, minutes] = selectedTime.split(':').map(Number)
        const dateToSend = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hours,
          minutes,
          0
        )

        await scheduleSessionMutation.mutateAsync({
          templateId: selectedTemplateId,
          date: dateToSend,
        })

        resetState()
        setOpen(false)

        await utils.session.invalidate()
        await utils.template.invalidate()

        toast({
          title: "Success",
          description: "Training session scheduled successfully.",
        })
      } catch (error) {
        console.error('Failed to schedule session:', error)
        toast({
          title: "Error",
          description: "Failed to schedule training session. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4)
    const minute = (i % 4) * 15
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Schedule a training</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Training Session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border w-full"
          />
          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select onValueChange={(value) => setSelectedTemplateId(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templatesQuery.data && templatesQuery.data.length > 0 ?
                templatesQuery.data.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                )) :
                <Button
                  onClick={() => {
                    setOpen(false)
                    router.push('/app/workouts')
                  }}
                  className="w-full"
                >
                  Create a template
                </Button>
              }
            </SelectContent>
          </Select>
          <Button onClick={handleSchedule} disabled={!selectedDate || !selectedTemplateId}>
            Schedule Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ScheduleSession
