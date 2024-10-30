import React, { useState } from 'react';
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
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  exerciseId: number;
  setIds: number[];
}

interface FinishWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    privacy: 'public' | 'friends' | 'private';
    note: string;
    title: string;
    rating: number;
    endTime: Date;
    selectedMedia: string[];
  }) => void;
  isLoading: boolean;
  defaultTitle: string;
  startTime: Date;
  availableMedia: MediaItem[];
}

export const FinishWorkoutModal: React.FC<FinishWorkoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  defaultTitle,
  startTime,
  availableMedia = [],
}) => {
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [note, setNote] = useState('');
  const [title, setTitle] = useState(defaultTitle);
  const [rating, setRating] = useState(5);
  const [endTime, setEndTime] = useState(new Date());
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Workout Post</DialogTitle>
          <DialogDescription>
            Customize how your workout will appear in your feed
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
              placeholder="How did your workout go? Share your thoughts..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-24"
            />
          </div>

          {availableMedia.length > 0 && (
            <div className="space-y-2">
              <Label>Workout Media</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableMedia.map((media) => (
                  <Card 
                    key={media.id}
                    className={`cursor-pointer transition-all ${
                      selectedMedia.includes(media.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleMediaSelection(media.id)}
                  >
                    <CardContent className="p-2">
                      {media.type === 'image' ? (
                        <Image
                          src={media.url}
                          alt="Exercise media"
                          width={100}
                          height={100}
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-[100px] object-cover rounded-md"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime.toISOString().slice(0, 16)}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">How tough was this workout? (1-10)</Label>
            <Select 
              value={rating.toString()} 
              onValueChange={(value) => setRating(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
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
              value={privacy} 
              onValueChange={(value: 'public' | 'friends' | 'private') => setPrivacy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Only Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
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
