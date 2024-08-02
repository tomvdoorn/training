"use client"
import React, { useState } from 'react';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

const  TemplateManager = () =>{
  const [templateName, setTemplateName] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);

  const createTemplateMutation = api.template.createTemplate.useMutation();
  const addExerciseMutation = api.template.addExerciseToTemplate.useMutation();
  const addSetMutation = api.set.addSetToTemplateExercise.useMutation();
  const updateSetMutation = api.set.updateSet.useMutation();
  const deleteTemplateMutation = api.template.deleteTemplate.useMutation();
  const deleteExerciseMutation = api.exercise.deleteUserExercise.useMutation();
  const deleteSetMutation = api.set.deleteSet.useMutation();

  const exercisesQuery = api.exercise.getExercises.useQuery();
  const { data: session } = useSession()


  const handleCreateTemplate = async () => {
    if (!session) return;
    const newTemplate = await createTemplateMutation.mutateAsync({ name: templateName, userId: session.user.id });
    setTemplateId(newTemplate.id);
  };

  const handleAddExercise = async () => {
    if (templateId && selectedExerciseId !== null) {
      await addExerciseMutation.mutateAsync({ templateId, exerciseId: selectedExerciseId, order: 1 });
    }
  };

  const handleAddSet = async (templateExerciseId: number) => {
    await addSetMutation.mutateAsync({ templateExerciseId });
  };

  const handleDeleteTemplate = async () => {
    if (templateId) {
      await deleteTemplateMutation.mutateAsync({ templateId });
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    await deleteExerciseMutation.mutateAsync({ exerciseId, userId: 'your-user-id' });
  };

  const handleDeleteSet = async (setId: number) => {
    await deleteSetMutation.mutateAsync({ setId });
  };

  return (
    <div>
      <h1>Manage Template</h1>
      <input
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="Template Name"
      />
      <button onClick={handleCreateTemplate}>Create Template</button>

      {/* {templateId && (
        <>
          <h2>Add Exercise</h2>
          <select onChange={(e) => setSelectedExerciseId(Number(e.target.value))}>
            <option value="">Select an exercise</option>
            {exercisesQuery.data?.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddExercise}>Add Exercise</button> */}

          {/* Here you can add the UI for managing sets */}
          {/* Assuming you have a list of template exercises and their sets */}
          {/* Example to add a set to a template exercise */}
          {/* <button onClick={() => handleAddSet(1)}>Add Set to Exercise 1</button> */}
          {/* Example to update a set */}
          {/* <button onClick={() => handleUpdateSet(1, { reps: 10, weight: 50 })}>Update Set 1</button> */}
          {/* Example to delete a set */}
          {/* <button onClick={() => handleDeleteSet(1)}>Delete Set 1</button> */}

          {/* UI to delete template */}
          {/* <button onClick={handleDeleteTemplate}>Delete Template</button> */}
        {/* </> */}
      {/* )} */}

      {/* UI to delete an exercise */}
      {/* <button onClick={() => handleDeleteExercise(1)}>Delete Exercise 1</button> */}
    </div>
  );
};

export default TemplateManager;