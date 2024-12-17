"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "~/components/ui/input";

interface AddTemplateProps {
  userId: string;
  createTemplate: {
    mutate: (data: { name: string; userId: string }) => void;
    isPending: boolean;
  };
}

const AddTemplate: React.FC<AddTemplateProps> = ({ userId, createTemplate }) => {
  const router = useRouter();
  const [name, setTemplateName] = useState("");

  return (
    <form
      id="template-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        createTemplate.mutate({ name, userId });
      }}
    >
      <Input
        value={name}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="Template Name"
        required
        minLength={1}
        className="bg-gray-800/50 text-brand-light border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default AddTemplate;


