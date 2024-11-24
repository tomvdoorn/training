"use client"

import { api } from "~/trpc/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Calendar, MoreVertical } from "lucide-react"
import ScheduleTrainingPlanModal from "./ScheduleTrainingPlanModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { CompactTrainingPlanCreatorComponent } from "~/components/compact-training-plan-creator"
import { Badge } from "~/components/ui/badge"
import { StoreListingDialog } from "~/components/app/store/StoreListingDialog"

interface TrainingPlansProps {
  userId: string
}

const TrainingPlans = ({ userId }: TrainingPlansProps) => {
  const { toast } = useToast();
  const utils = api.useContext();
  const [editingPlan, setEditingPlan] = useState<{
    id: string;
    name: string;
    duration: number;
    templates: {
      id: number;
      templateId: number | null;
      day: number;
    }[];
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: trainingPlans, isLoading, error } = api.trainingPlan.getTrainingPlans.useQuery({
    userId
  });

  const deletePlanMutation = api.trainingPlan.deletePlan.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Training plan has been deleted",
      });
      // Invalidate the training plans query to refresh the list
      void utils.trainingPlan.getTrainingPlans.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeletePlan = async (planId: string) => {
    await deletePlanMutation.mutateAsync({ planId });
  };

  if (isLoading) return <div>Loading training plans...</div>
  if (error) return <div>Error loading training plans: {error.message}</div>

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingPlans?.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>
                <div className="grid grid-cols-8">
                  <h2 className="col-start-1 col-end-7 text-xl ">{plan.name}</h2>
                  <div className="col-start-8 item-right">
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingPlan({
                            id: plan.id.toString(),
                            name: plan.name,
                            duration: plan.duration,
                            templates: plan.templates
                          });
                          setIsEditModalOpen(true);
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                          // Prevent the dropdown from closing
                          e.preventDefault()
                        }}>
                          <StoreListingDialog
                            type="TrainingPlan"
                            itemId={parseInt(plan.id.toString())}
                            existingListing={plan.store_listing}
                            trigger={<div className="w-full">List in Store</div>}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePlan(plan.id.toString())}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <span className="col-span-3 text-muted-foreground">{plan.duration} days</span>

                  <Badge variant="secondary" className="col-span-3">
                    {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="flex items-center  ">
                {plan.templates.length != 0 ? plan.templates.map((template, index, array) => (
                  <>
                    {template.template?.name ? template.template.name : "Rest Day"}{index < array.length - 1 ? ", " : ""}
                  </>
                )) : "No Sessions"}
              </CardDescription>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="flex justify-between w-full gap-2">
                <ScheduleTrainingPlanModal planId={plan.id.toString()} planDuration={plan.duration}>
                  <Button variant="outline" >
                    <Calendar className="mr-2 h-4 w-4" /> Schedule
                  </Button>
                </ScheduleTrainingPlanModal>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          {editingPlan && (
            <CompactTrainingPlanCreatorComponent
              mode="edit"
              existingPlan={editingPlan}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingPlan(null);
              }}
              userId={userId}
              onSuccess={() => {
                setIsEditModalOpen(false);
                setEditingPlan(null);
                toast({
                  title: "Success",
                  description: "Training plan updated successfully",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TrainingPlans
