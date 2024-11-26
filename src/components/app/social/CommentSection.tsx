import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";
import type { User } from "@prisma/client";
import { useQueryClient } from '@tanstack/react-query';
import { Textarea } from '~/components/ui/textarea';
import { Heart } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
  };
  likes: { userId: string }[];
}

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  currentUser: User | null;
  isExpanded: boolean;
}

export function CommentSection({ postId, comments, currentUser, isExpanded }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const addCommentMutation = api.post.addComment.useMutation();
  const queryClient = useQueryClient();
  const toggleCommentLikeMutation = api.post.toggleCommentLike.useMutation();

  const handleAddComment = async () => {
    if (!currentUser || !commentText.trim()) return;

    try {
      await addCommentMutation.mutateAsync({ postId, content: commentText });
      setCommentText('');
      // Refetch comments to update the UI
      await queryClient.invalidateQueries({ queryKey: ['post.getAllPosts'] });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline
      void handleAddComment();
    }
  };

  const handleToggleLike = async (commentId: number) => {
    if (!currentUser) return;

    try {
      await toggleCommentLikeMutation.mutateAsync({ commentId });
      await queryClient.invalidateQueries({ queryKey: ['post.getAllPosts'] });
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="flex items-start space-x-2 mb-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.user?.image ?? undefined} alt={comment.user?.firstName ?? ''} />
        <AvatarFallback>{comment.user?.firstName?.charAt(0) ?? ''}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="text-sm font-semibold">{comment.user?.firstName} {comment.user?.lastName}</p>
        <p className="text-sm">{comment.content}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 p-0"
        onClick={() => handleToggleLike(comment.id)}
      >
        <Heart className={`h-4 w-4 ${comment.likes && comment.likes.some(like => like.userId === currentUser?.id) ? 'fill-red-500 text-red-500' : ''}`} />
        <span className="text-xs">{comment.likes?.length ?? 0}</span>
      </Button>
    </div>
  );

  return (
    <div className="mt-4">
      <div className="mb-4">
        {comments.slice(-3).map(renderComment)}
      </div>
      {currentUser && isExpanded && (
        <div className="flex items-start space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.image ?? undefined} alt={currentUser.firstName ?? ''} />
            <AvatarFallback>{currentUser.firstName?.charAt(0) ?? ''}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a comment..."
              className="w-full"
              rows={1}
            />
            <Button onClick={handleAddComment} className="mt-2">
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
