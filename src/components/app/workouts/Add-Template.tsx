"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddTemplateProps {
  userId: string;
}

const  AddTemplate: React.FC<AddTemplateProps> = ({userId}) => {
    const router = useRouter();
    const [name, setTemplateName] = useState("");

  const createTemplate = api.template.createTemplate.useMutation({
    onSuccess: ({id}) => {
        console.log("Template created"+ id)
        const route =  `/app/workouts/edit/${id}`
        router.push(route)
      setTemplateName("");
    },
  });

    return (
    <>
      <h1>Manage Template</h1>
      <form
      onSubmit={(e) => {
        e.preventDefault();
        createTemplate.mutate({ name, userId } )
        }}>
      <input
        value={name}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="Template Name"
      />
      <button 
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createTemplate.isPending}
      >
                  {createTemplate.isPending ? "Submitting..." : "Create Template"}
 </button>
        </form>
    </>
    )
}

export default AddTemplate;


