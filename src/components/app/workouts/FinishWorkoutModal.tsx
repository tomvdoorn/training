import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { MediaSelector } from './MediaSelector';
import { useWorkoutTemplateStore } from '~/stores/workoutTemplateStore';
import { Upload } from 'lucide-react';
import { uploadFileToStorage } from '~/utils/supabase';
import { useAuthSession } from '~/hooks/useSession';


interface FinishWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    privacy: 'public' | 'followers' | 'private';
    note: string;
    title: string;
    rating: number;
    endTime: Date;
    selectedMedia: string[];
  }) => void;
  isLoading: boolean;
  defaultTitle: string;
  startTime: Date;
}

export const FinishWorkoutModal: React.FC<FinishWorkoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  defaultTitle,
  startTime,
}) => {
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [note, setNote] = useState('');
  const [title, setTitle] = useState(defaultTitle);
  const [rating, setRating] = useState(5);
  const [endTime, setEndTime] = useState(new Date());

  const handleEndTimeChange = (newTime: string) => {
    const newEndTime = new Date(newTime);
    if (newEndTime >= startTime) {
      setEndTime(newEndTime);
    }
  };

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMedia(prev =>
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };
  const exercises = useWorkoutTemplateStore(state => state.exercises);
  const generalMedia = useWorkoutTemplateStore(state => state.generalMedia);
  const { addGeneralMedia } = useWorkoutTemplateStore();
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  // Get all pending media from exercises
  const getAllPendingMedia = useCallback(() => {
    // Get exercise-specific media
    const exerciseMedia = exercises.flatMap(exercise =>
      exercise.pendingMedia?.map(media => ({
        file: media.file,
        fileType: media.fileType,
        setIndices: media.setIndices,
        exerciseId: exercise.id
      })) ?? []
    );

    // Get general media
    const generalMediaItems = generalMedia.map(media => ({
      file: media.file,
      fileType: media.fileType,
      setIndices: [],
      exerciseId: null
    }));

    return [...exerciseMedia, ...generalMediaItems];
  }, [exercises, generalMedia]);
  const session = useAuthSession();
  if (!session?.supabaseAccessToken) {
    console.error('No user session found token ');
    return null;
  }
  // Add handleFileUpload function
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files;
    if (!files) return;

    try {
      for (const file of Array.from(files)) {
        const fileUrl = await uploadFileToStorage(file, session?.supabaseAccessToken ?? '');
        console.log('fileUrl', fileUrl);
        if (!fileUrl) {
          console.error('Failed to upload file');
          return;
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
        let fileType = 'unknown';

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
          fileType = 'image';
        } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(fileExtension)) {
          fileType = 'video';
        }

        addGeneralMedia({
          file: fileUrl,
          fileType,
          setIndices: []
        });
        console.log('addPendingMedia', addGeneralMedia);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Finish Workout</DialogTitle>
          <DialogDescription>
            Save your workout and share your progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your workout a title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Description</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did your workout go? Share your thoughts..."
              className="h-24"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add Photos/Videos</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {getAllPendingMedia().length > 0 && (
              <MediaSelector
                pendingMedia={getAllPendingMedia()}
                onSelectionChange={setSelectedMedia}
                maxSelections={5}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              max={new Date().toISOString().slice(0, 16)}
              value={endTime.toISOString().slice(0, 16)}
              onChange={(e) => handleEndTimeChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">How tough was this workout? (1-10)</Label>
            <Select
              defaultValue="5"
              value={rating.toString()}
              onValueChange={(value) => setRating(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy">Who can see this post?</Label>
            <Select
              defaultValue="public"
              value={privacy}
              onValueChange={(value) => setPrivacy(value as 'public' | 'followers' | 'private')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
                <SelectItem value="private">Only Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm({
              privacy,
              note,
              title,
              rating,
              endTime,
              selectedMedia
            })}
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : 'Publish Workout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
