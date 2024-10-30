"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { CompactTrainingPlanCreatorComponent } from "~/components/compact-training-plan-creator"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useSession } from "next-auth/react"

export default function AddTemplateButton() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTitle>
            </DialogTitle>
      <DialogTrigger asChild>
        <Button>Create Training Plan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="dialog-description">
        <CompactTrainingPlanCreatorComponent 
          onClose={() => setIsModalOpen(false)} 
          userId={session?.user.id ?? ''} 
          onSuccess={() => setIsModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

