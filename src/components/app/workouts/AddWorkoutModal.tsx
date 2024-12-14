import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/ui/credenza"
import AddTemplate from "@/components/app/workouts/Add-Template"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface workoutModal {
    user_id: string;
}
export default function WorkoutModal({ user_id }: workoutModal) {

    return (
        <>
            <Credenza>
                <CredenzaTrigger asChild>
                    <Button className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
                        <PlusCircle className="mr-2 h-4 w-4 bg-brand-gradient-r text-gray-900" /> Create New Template
                    </Button>
                </CredenzaTrigger>
                <CredenzaContent className="bg-brand-dark border-brand-dark">
                    <CredenzaHeader>
                        <CredenzaTitle className="text-brand-light">Add Workout Template</CredenzaTitle>
                        <CredenzaDescription className="text-gray-300">
                            Create a workout template to use in your training sessions.
                        </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                        <AddTemplate userId={user_id} />
                    </CredenzaBody>
                    <CredenzaFooter>
                        <CredenzaClose asChild>
                            <button className="bg-brand-dark/90 hover:bg-brand-dark/80">Close</button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </CredenzaContent>
            </Credenza>
        </>
    )
}

