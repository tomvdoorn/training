import React, { useState } from 'react';
import { api as trpc } from "@/trpc/react";


const AddExercise: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [type, setType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [userId, setUserId] = useState(''); // Assume this comes from authentication context

  const addExercise = trpc.exercise.addExercise.useMutation();
  const deleteExercise = trpc.exercise.deleteUserExercise.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExercise.mutateAsync({
        name,
        description,
        muscleGroup,
        type,
        imageUrl,
        videoUrl,
        userId,
      });
      // Reset form fields
      setName('');
      setDescription('');
      setMuscleGroup('');
      setType('');
      setImageUrl('');
      setVideoUrl('');
      alert('Exercise added successfully!');
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Failed to add exercise');
    }
  };

  const handleDelete = async (exerciseId: number) => {
    try {
      await deleteExercise.mutateAsync({ exerciseId, userId });
      alert('Exercise deleted successfully!');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('Failed to delete exercise');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Muscle Group:</label>
          <input
            type="text"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div>
          <label>Video URL:</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <button type="submit">Add Exercise</button>
      </form>
      {/* Add button for testing delete functionality */}
      <button onClick={() => handleDelete(1)}>Delete Exercise</button> {/* Replace 1 with actual exercise ID */}
    </div>
  );
};

export default AddExercise;
