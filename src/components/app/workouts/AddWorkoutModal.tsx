import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import AddTemplate from "@/components/app/workouts/Add-Template"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface workoutModal {
    user_id: string;
}

export default function WorkoutModal({ user_id }: workoutModal) {
    const [templateName, setTemplateName] = useState("");

    const router = useRouter();

    const createTemplate = api.template.createTemplate.useMutation({
        onSuccess: ({ id }) => {
            console.log("Template created:", id);
            router.push(`/app/workouts/edit/${id}`);
            setTemplateName("");
        },
    });
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
                    <PlusCircle className="mr-2 h-4 w-4 bg-brand-gradient-r text-gray-900" /> Create New Template
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-brand-dark border-brand-dark max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-brand-light">Add Workout Template</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Create a workout template to use in your training sessions.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <AddTemplate userId={user_id} createTemplate={createTemplate} />
                </div>
                <DialogFooter className="flex justify-between">
                    <DialogClose asChild>
                        <Button variant="ghost" className="bg-brand-dark/90 hover:bg-brand-dark/80">Close</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form="template-form"
                        className="bg-brand-gradient-r text-gray-900 hover:opacity-90"
                        disabled={createTemplate.isPending}
                    >
                        {createTemplate.isPending ? "Submitting..." : "Create Template"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

