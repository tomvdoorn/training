"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { api } from "~/trpc/react"
import { useToast } from "~/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"


interface AcquireSuccess {
  success: boolean;
  copied_id: number | null;
}

interface StoreListingWithRelations {
  id: number;
  title: string;
  description: string;
  preview_image: string | null;
  purchase_count: number;
  status: 'Active' | 'Inactive';
  type: 'Template' | 'TrainingPlan';
  template_id: number | null;
  training_plan_id: number | null;
}

export default function StorePage() {
  const [typeFilter, setTypeFilter] = useState<"Template" | "TrainingPlan" | "all">("all")
  // TODO: Add difficulty and duration filters
  // const [difficultyFilter, setDifficultyFilter] = useState("all")
  // const [durationFilter, setDurationFilter] = useState("all")
  const { toast } = useToast()
  const router = useRouter()

  const { data: listings, isLoading } = api.store.getListings.useQuery({
    type: typeFilter === "all" ? undefined : typeFilter,
  })

  const acquireMutation = api.store.acquireItem.useMutation({
    onSuccess: (data: AcquireSuccess) => {
      toast({
        title: "Success!",
        description: "Item added to your collection. Find it in your templates.",
      })

    },
    onError: (error) => { // Use TRPCClientErrorLike type if needed
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleAcquire = (listingId: number) => {
    acquireMutation.mutate({ listing_id: listingId })
  }

  // Update the mutation status check
  const isPending = acquireMutation.status === 'pending';

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="container mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 ">Store</h1>
          <p className="text-gray-600">Discover and acquire new workout templates and training plans</p>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          <Select onValueChange={(value: string) => setTypeFilter(value as "Template" | "TrainingPlan" | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Template">Template</SelectItem>
              <SelectItem value="TrainingPlan">Training Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings?.map((listing: StoreListingWithRelations) => (
            <Card key={listing.id} className="overflow-hidden">
              {listing.preview_image && (
                <Image src={listing.preview_image} alt={listing.title} className="w-full h-40 object-cover" />
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <Badge variant={listing.type === "Template" ? "default" : "secondary"}>
                    {listing.type}
                  </Badge>
                </div>
                <CardDescription>{listing.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  Downloaded {listing.purchase_count} times
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleAcquire(listing.id)}
                  disabled={isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Get {listing.type}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
