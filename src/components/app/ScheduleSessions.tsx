import React, { useState } from 'react'
import { useSchedulingStore } from '@/stores/schedulingStore'
import { api as trpc } from "~/trpc/react"  
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

const ScheduleSession = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { selectedDate, selectedTemplateId, setSelectedDate, setSelectedTemplateId, resetState } = useSchedulingStore()
  const scheduleSessionMutation = trpc.session.scheduleSession.useMutation()
  const templatesQuery = trpc.template.getTemplatesUser.useQuery()
  const utils = trpc.useContext()

  const handleSchedule = async () => {
    if (selectedDate && selectedTemplateId) {
      try {
        // Get the user's local timezone offset in minutes
        const timezoneOffset = new Date().getTimezoneOffset()

        // Create a new Date object set to noon UTC on the selected date
        const dateToSend = new Date(Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          12, 0, 0, 0
        ))

        // Adjust for the timezone offset
        dateToSend.setMinutes(dateToSend.getMinutes() - timezoneOffset)

        await scheduleSessionMutation.mutateAsync({
          templateId: selectedTemplateId,
          date: dateToSend,
        })
        
        resetState()
        setOpen(false)
        
        // Invalidate and refetch relevant queries
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