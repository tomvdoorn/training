"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Repeat2, Activity, Bike, Dumbbell, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "~/trpc/react"
import { CommentSection } from "./CommentSection"
import { useState } from "react"
import { useQueryClient } from '@tanstack/react-query';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

import type { User, Post } from "@prisma/client"
// Helper function to calculate relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'run':
      return <Activity className="h-5 w-5" />
    case 'cycle':
      return <Bike className="h-5 w-5" />
    case 'weightlifting':
    default:
      return <Dumbbell className="h-5 w-5" />
  }
}

const StatisticsTable = ({ stats }: { stats: { [key: string]: string | number } }) => (
  <Table>
    <TableCaption className="text-primary-foreground">Key Statistics</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px] text-primary-foreground">Metric</TableHead>
        <TableHead className="text-primary-foreground">Value</TableHead>
      </TableRow>
    </TableHeader>      
    <TableBody>
      {Object.entries(stats).map(([key, value]) => (
        <TableRow key={key}>
          <TableCell className="font-medium text-primary-foreground">{key}</TableCell>
          <TableCell className="text-primary-foreground">{value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

// Update the type definition for the currentUser prop to match what getCurrentUser() returns
interface SportsSocialFeedProps {
      currentUser: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    },
  profileUserId?: string;
}

export default function SportsSocialFeed({ currentUser, profileUserId }: SportsSocialFeedProps) {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const { data: posts, isLoading, error } = api.post.getAllPosts.useQuery(
    profileUserId ? { profileUserId: profileUserId } : undefined
  );
  const toggleLikeMutation = api.post.toggleLike.useMutation();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const deletePostMutation = api.post.deletePost.useMutation();
  const deleteSessionMutation = api.session.deleteSession.useMutation();

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleToggleLike = async (postId: number) => {
    if (!currentUser) return;

    try {
      await toggleLikeMutation.mutateAsync({ postId });
      queryClient.invalidateQueries({ queryKey: ['post.getAllPosts'] });
    } catch (error) {
      console.error('Error toggling post like:', error);
    }
  };

  const handleDeletePost = async (trainingSessionId: number) => {
    if (postToDelete) {
      try {
        await deletePostMutation.mutateAsync({ trainingSessionId: postToDelete });
        await deleteSessionMutation.mutateAsync({ id: trainingSessionId });
        queryClient.invalidateQueries({ queryKey: ['post.getAllPosts'] });
        setPostToDelete(null);
        toast({
          title: "Success",
          description: "Post and associated session deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: "Error",
          description: "Failed to delete post and session. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!posts || posts.length === 0) return <div>No posts yet</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="w-full overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4">
            <Link href={`/app/profile/${post.user.id}`} className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.user.image || undefined} alt={post.user.firstName || ''} />
                <AvatarFallback>{post.user.firstName?.charAt(0) || ''}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{post.user.firstName} {post.user.lastName}</p>
                <p className="text-xs text-muted-foreground">{getRelativeTime(new Date(post.createdAt))}</p>
              </div>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <ActivityIcon type={post.trainingSession?.template?.name || 'weightlifting'} />
              {post.user.id === currentUser.id && (
              <Button variant="ghost" size="icon" className="rounded-full">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                post and the associated training session.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => {
                                if (post.trainingSessionId) {
                                  handleDeletePost(post.trainingSessionId);
                                }
                                setPostToDelete(post.id);
                              }}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
                </Button>)}
            </div>
          </CardHeader>
          <CardContent className="p-0 relative">
            <div className="flex flex-col text-primary-foreground pl-4 gap-2">
              <h2 className="text-xl font-bold mb-2 text-black">{post.title}</h2>
              <p className="text-sm mb-4 text-gray-500">{post.note}</p>
            </div>
            <div className="relative h-[300px] overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="p-4 w-full max-w-md">
                  <div className="bg-black bg-opacity-50 rounded-lg overflow-hidden mb-4">
                    <StatisticsTable stats={{
                      "Total Weight Lifted": `${post.totalWeightLifted} kg`,
                      "Number of PRs": post.numberOfPRs,
                      "Highlighted Exercise": post.highlightedExerciseName || 'N/A'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex justify-between w-full">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleToggleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.likes.some(like => like.userId === currentUser?.id) ? 'fill-current text-red-500' : ''}`} />
                  <span>{post.likes.length}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Repeat2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
            <div className="w-full">
                <CommentSection
                  postId={post.id}
                  comments={post.comments}
                  currentUser={currentUser as User}
                  isExpanded={expandedComments.has(post.id)}
                />

            </div>
            {post.privacy === 'private' && currentUser?.id === post.user.id && (
              <div className="text-sm text-muted-foreground">
                This post is only visible to you.
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
