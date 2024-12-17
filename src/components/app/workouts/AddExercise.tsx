"use client"
import React, { useState } from 'react';
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MuscleGroup } from '@prisma/client'
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import type { Exercise } from '@prisma/client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Exercise from './Exercises';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  muscleGroup: z.string().min(1, "Muscle group is required"),
  categoryId: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>;

interface AddExerciseProps {
  templateId: number;
  onExerciseAdded: (newExercise: Exercise) => void;
  children?: React.ReactNode;
}

const AddExercise: React.FC<AddExerciseProps> = ({ templateId, onExerciseAdded, children }) => {
  const { data: exerciseCategories, error, isLoading } = api.exercise.getExerciseCategories.useQuery();
  const { addExercise } = useWorkoutTemplateStore();
  const [isOpen, setIsOpen] = useState(false);
  const addExerciseMutation = api.exercise.addExercise.useMutation<Exercise>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      muscleGroup: "",
      categoryId: "",
      type: "",
      imageUrl: "",
      videoUrl: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!templateId) {
        throw new Error("Template ID is required");
      }

      const newExercise = await addExerciseMutation.mutateAsync({
        name: values.name,
        description: values.description,
        muscleGroup: values.muscleGroup as MuscleGroup,
        categoryId: Number(values.categoryId),
        type: values.type === "Compound" ? 1 : 2,
        image: values.imageUrl || undefined,
        video: values.videoUrl || undefined,
      });

      if (!newExercise) {
        throw new Error("Failed to create exercise");
      }

      const templateExercise = {
        templateId,
        exerciseId: newExercise.id,
        exercise: newExercise,
        order: 0,
        sets: [],
        id: undefined,
        isNew: true,
      };

      addExercise(templateExercise);
      onExerciseAdded(templateExercise);
      form.reset();

      setIsOpen(false);

    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  if (error) return <div>Error loading exercises: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children || (
          <Button variant="default">
            Add New Exercise
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}>
        <DialogContent className="bg-brand-dark border-brand-dark max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-light">Add New Exercise</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Exercise name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Exercise description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="muscleGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muscle Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select muscle group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(MuscleGroup).map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {exerciseCategories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Compound">Compound</SelectItem>
                        <SelectItem value="Isolation">Isolation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    form.reset();
                  }}
                  className="bg-brand-dark/90 hover:bg-brand-dark/80"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-gradient-r text-gray-900 hover:opacity-90"
                >
                  Add Exercise
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddExercise;