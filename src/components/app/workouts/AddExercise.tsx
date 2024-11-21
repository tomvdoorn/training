"use client"
import React, { useState } from 'react';
import { api } from "~/trpc/react";
import Modal from "@/components/modal"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MuscleGroup } from '@prisma/client'
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import type { Exercise } from '@prisma/client';

interface AddExerciseProps {
  templateId: number;
  onExerciseAdded: (newExercise: Exercise) => void;
  children?: React.ReactNode;
}

const AddExercise: React.FC<AddExerciseProps> = ({ templateId, onExerciseAdded, children }) => {
  const { data: exerciseCategories, error, isLoading } = api.exercise.getExerciseCategories.useQuery();
  const { addExercise } = useWorkoutTemplateStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | ''>('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const addExerciseMutation = api.exercise.addExercise.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !muscleGroup) return;

    try {
      const newExercise = await addExerciseMutation.mutateAsync({
        name,
        description,
        muscleGroup,
        categoryId: Number(categoryId),
        type: Number(type),
        image: imageUrl,
        video: videoUrl,
      });

      addExercise({
        templateId,
        exerciseId: newExercise.id,
        exercise: newExercise,
        order: 0, // You might want to set this to the current number of exercises + 1
      });

      onExerciseAdded(newExercise);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding exercise:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setMuscleGroup('');
    setCategoryId(null);
    setType('');
    setImageUrl('');
    setVideoUrl('');
  };

  if (error) {
    return <div>Error loading exercises: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {children ? (
        <div onClick={() => setIsModalOpen(true)}>{children}</div>
      ) : (
        <Button
          className="text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Exercise
        </Button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Exercise Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description:
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Exercise Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="muscleGroup">
                Muscle Group:
              </label>
              <Select onValueChange={(value) => setMuscleGroup(value as MuscleGroup)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MuscleGroup).map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category:
              </label>
              <Select onValueChange={(value) => setCategoryId(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Type:
              </label>
              <Select onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compound">Compound</SelectItem>
                  <SelectItem value="Isolation">Isolation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
                Image URL:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="imageUrl"
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
                Video URL:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="videoUrl"
                type="url"
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Exercise
              </Button>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddExercise;