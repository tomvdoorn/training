import { Button } from "~/components/ui/button"
import { MoreVertical, Store } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StoreListingDialog } from "~/components/app/store/StoreListingDialog"

interface TemplateCardProps {
  template: {
    id: number;
    name: string;
    store_listing: {
      id: number;
      title: string;
      description: string;
      preview_image: string | null;
      status: 'Active' | 'Inactive';
    } | null;
  };
  onEdit: () => void;
  onDelete: (id: number) => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <StoreListingDialog 
            type="Template"
            itemId={template.id}
            existingListing={template.store_listing}
          />
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => onDelete(template.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 