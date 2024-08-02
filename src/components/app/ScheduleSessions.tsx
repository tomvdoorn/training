import React from 'react'
import { useSchedulingStore } from '@/stores/schedulingStore'
import { api as trpc } from "~/trpc/react"  
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, parseISO, startOfDay } from 'date-fns'

const ScheduleSession = () => {
  const { selectedDate, selectedTemplateId, setSelectedDate, setSelectedTemplateId, resetState } = useSchedulingStore()
  const scheduleSessionMutation = trpc.session.scheduleSession.useMutation()
  const templatesQuery = trpc.template.getTemplatesUser.useQuery()

  const handleSchedule = async () => {
    if (selectedDate && selectedTemplateId) {
      try {
        await scheduleSessionMutation.mutateAsync({
          templateId: selectedTemplateId,
          date: selectedDate,
        })
        resetState()
        // You might want to add some success feedback here
      } catch (error) {
        console.error('Failed to schedule session:', error)
        // You might want to add some error feedback here
      }
    }
  }

  return (
    <Dialog>
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
          <Select onValueChange={(value) => setSelectedTemplateId(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templatesQuery.data?.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
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