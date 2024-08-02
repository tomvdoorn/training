import CarouselItems from "@/components/app/CarouselItem"; // Ensure the path is correct
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";



const Page = () => {


    return (
        <>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div >
            
            <h1 className="text-2xl font-semibold py-5">Training</h1>
                    <CarouselItems />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                    Recent transactions from your store.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
                <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                </CardContent>
            </Card>
            </div>
        </main>
    </>
    )
}

export default Page;
