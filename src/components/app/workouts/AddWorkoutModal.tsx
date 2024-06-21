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
import TemplateManager from "./TemplateManager";
import AddExercise from "./AddExercise";

const WorkoutModal = () => {

return(
    <Credenza>
    <CredenzaTrigger asChild>
        <button>Open modal</button>
    </CredenzaTrigger>
    <CredenzaContent>
        <CredenzaHeader>
        <CredenzaTitle>Credenza</CredenzaTitle>
        <CredenzaDescription>
            A responsive modal component for shadcn/ui.
        </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
        <TemplateManager />
        <AddExercise />
        </CredenzaBody>
        <CredenzaFooter>
        <CredenzaClose asChild>
            <button>Close</button>
        </CredenzaClose>
        </CredenzaFooter>
    </CredenzaContent>
    </Credenza>
)
}

export default WorkoutModal;