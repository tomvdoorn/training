"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"

interface CompactTrainingPlanCreatorComponentProps {
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
  existingPlan?: {
    id: string;
    name: string;
    duration: number;
    templates: {
      id: number;
      templateId: number | null;
      day: number;
    }[];
  };
  mode?: 'create' | 'edit';
}

interface TrainingPlan {
  name: string;
  duration: number;
  templates: (string)[];
}

export function CompactTrainingPlanCreatorComponent({
  onClose,
  userId,
  onSuccess,
  existingPlan,
  mode = 'create'
}: CompactTrainingPlanCreatorComponentProps) {
  const [plan, setPlan] = useState<TrainingPlan>(() => {
    if (existingPlan) {
      return {
        name: existingPlan.name,
        duration: existingPlan.duration,
        templates: Array(existingPlan.duration).fill(null).map((_, index): string => {
          const template = existingPlan.templates?.find(t => t.day === index + 1);
          return template?.templateId?.toString() ?? "rest";
        })
      };
    }
    return { name: "", duration: 7, templates: Array(7).fill("rest") as string[] };
  });

  const { data: templates, isLoading } = api.template.getTemplatesUser.useQuery();
  const createTrainingPlanMutation = api.trainingPlan.createTrainingPlan.useMutation();
  const updateTrainingPlanMutation = api.trainingPlan.updateTrainingPlan.useMutation();
  const utils = api.useContext();

  const handleChange = (field: string, value: string | number | string[]) => {
    setPlan((prev: TrainingPlan) => {
      if (field === 'duration') {
        const newDuration = Number(value)
        return {
          ...prev,
          duration: newDuration,
          templates: newDuration > prev.templates.length
            ? [...prev.templates, ...Array(newDuration - prev.templates.length).fill("") as string[]]
            : prev.templates.slice(0, newDuration)
        }
      }
      if (field === 'templates') {
        const newTemplates = value as string[];
        return { ...prev, templates: newTemplates };
      }
      return { ...prev, [field]: value };
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const templateData = plan.templates
        .map((templateId, index) => ({
          templateId: templateId === "rest" ? null : templateId ? templateId.toString() : null,
          day: index + 1,
          userId: userId
        }))
        .filter(({ templateId }) => templateId !== '');

      if (mode === 'edit' && existingPlan) {
        await updateTrainingPlanMutation.mutateAsync({
          id: parseInt(existingPlan.id),
          name: plan.name,
          duration: plan.duration,
          templates: templateData,
          userId: userId,
          difficulty: "Beginner"
        });
      } else {
        await createTrainingPlanMutation.mutateAsync({
          name: plan.name,
          duration: plan.duration,
          templates: templateData,
          userId: userId,
          difficulty: "Beginner"
        });
      }

      await utils.trainingPlan.invalidate();
      await utils.template.invalidate();

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving training plan:", error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardHeader className="px-0 pt-0 bg-brand-dark/90">
        <CardTitle>{mode === 'edit' ? 'Edit Training Plan' : 'Create Training Plan'}</CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-6 bg-brand-dark/90">
        {/* Plan Name Section */}
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={plan.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter plan name"
            required
          />
        </div>

        {/* Duration Section */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (Days)</Label>
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-r-none"
              onClick={() => handleChange('duration', Math.max(1, plan.duration - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="duration"
              type="number"
              value={plan.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              min="1"
              required
              className="w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-l-none"
              onClick={() => handleChange('duration', plan.duration + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Training Days Section */}
        <div className="space-y-4">
          <Label>Training Schedule</Label>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {plan.templates.map((template, index) => (
              <div key={index} className="flex items-center space-x-3 bg-muted/40 p-2 rounded-lg">
                <span className="min-w-[60px] text-sm font-medium">Day {index + 1}</span>
                <Select
                  value={template || "rest"}
                  onValueChange={(value) => handleChange('templates', plan.templates.map((t, i) => i === index ? value : t))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select workout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rest">
                      <span className="font-medium">Rest Day</span>
                    </SelectItem>
                    {templates?.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full bg-brand-gradient-r text-gray-900 hover:opacity-90">
            {mode === 'edit' ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </CardContent>
    </form>
  )
}
