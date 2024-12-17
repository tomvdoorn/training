"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "~/trpc/react"
import { useToast } from "~/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface StoreListingDialogProps {
  type: "Template" | "TrainingPlan"
  itemId: number
  existingListing?: {
    id: number
    title: string
    description: string
    preview_image?: string | null
    status: 'Active' | 'Inactive'
  } | null
  trigger?: React.ReactNode
}


type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert"

export function StoreListingDialog({ type, itemId, existingListing, trigger }: StoreListingDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(existingListing?.title ?? "")
  const [description, setDescription] = useState(existingListing?.description ?? "")
  const [previewImage, setPreviewImage] = useState(existingListing?.preview_image ?? "")
  const [status, setStatus] = useState<'Active' | 'Inactive'>(existingListing?.status ?? 'Active')
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner")
  const { toast } = useToast()

  // Reset form when existingListing changes
  useEffect(() => {
    if (existingListing) {
      setTitle(existingListing.title)
      setDescription(existingListing.description)
      setPreviewImage(existingListing.preview_image ?? "")
      setStatus(existingListing.status)
    }
  }, [existingListing])

  const utils = api.useContext()

  const createListingMutation = api.store.createListing.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: `${type} listed in store successfully`,
      })
      setOpen(false)
      void utils.store.getListings.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    },
  })

  const updateListingMutation = api.store.updateListing.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Store listing updated successfully",
      })
      setOpen(false)
      void utils.store.getListings.invalidate()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    },
  })

  const isPending = createListingMutation.status === 'pending' || updateListingMutation.status === 'pending'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (existingListing) {
      updateListingMutation.mutate({
        id: existingListing.id,
        title,
        description,
        preview_image: previewImage || undefined,
        status,
        difficulty: type === "TrainingPlan" ? difficulty : undefined,
      })
    } else {
      createListingMutation.mutate({
        title,
        description,
        preview_image: previewImage || undefined,
        type,
        template_id: type === "Template" ? itemId : undefined,
        training_plan_id: type === "TrainingPlan" ? itemId : undefined,
        difficulty: type === "TrainingPlan" ? difficulty : undefined,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        {trigger ?? <Button>List in Store</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800/50 border-none m-2">
        <DialogHeader>
          <DialogTitle>{existingListing ? "Edit Store Listing" : "Create Store Listing"}</DialogTitle>
          <DialogDescription>
            Make your {type.toLowerCase()} available in the store for other users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your template/plan"
              required
            />
          </div>
          {type === "TrainingPlan" && (
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={difficulty}
                onValueChange={(value: Difficulty) => setDifficulty(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="preview_image">Preview Image URL (optional)</Label>
            <Input
              id="preview_image"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Enter image URL"
            />
          </div>
          {existingListing && (
            <div className="flex items-center space-x-2">
              <Switch
                id="listing-status"
                checked={status === 'Active'}
                onCheckedChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')}
              />
              <Label htmlFor="listing-status">
                {status === 'Active' ? 'Listed' : 'Unlisted'}
              </Label>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
