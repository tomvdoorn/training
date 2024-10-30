import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleTrainingPlanModalProps {
  children: React.ReactNode;
  planId: string;
  planDuration: number;
}

const ScheduleTrainingPlanModal = ({ children, planId, planDuration }: ScheduleTrainingPlanModalProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [repeatCount, setRepeatCount] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const createSessionsFromPlanMutation = api.trainingPlan.createSessionsFromPlan.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Training plan has been scheduled",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSchedule = async () => {
    if (!startDate || repeatCount < 1 || !session?.user?.id) return;

    await createSessionsFromPlanMutation.mutateAsync({
      trainingPlanId: planId,
      startDate: new Date(startDate),
      repeatCount,
      userId: session.user.id,
    });
  };

  // Calculate end date based on start date, plan duration and repeat count
  const endDate = startDate 
    ? format(addDays(new Date(startDate), (planDuration * repeatCount) - 1), 'PPP')
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Training Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatCount">Number of Weeks to Repeat</Label>
            <Input
              id="repeatCount"
              type="number"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value))}
              min="1"
              placeholder="Enter number of weeks"
            />
          </div>

          {startDate && endDate && (
            <div className="text-sm text-muted-foreground">
              This plan will run from {format(new Date(startDate), 'PPP')} to {endDate}
            </div>
          )}

          <Button 
            onClick={handleSchedule} 
            className="w-full"
            disabled={createSessionsFromPlanMutation.isPending}
          >
            {createSessionsFromPlanMutation.isPending ? "Scheduling..." : "Schedule Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTrainingPlanModal;
