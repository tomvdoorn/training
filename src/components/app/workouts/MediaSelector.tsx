import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "~/lib/utils";
import { supabase } from '~/utils/supabase';

interface MediaItem {
  file: string;
  fileType: string;
  setIndices: number[];
}

interface MediaSelectorProps {
  pendingMedia: MediaItem[];
  onSelectionChange: (selectedUrls: string[]) => void;
  maxSelections?: number;
}

export function MediaSelector({ 
  pendingMedia, 
  onSelectionChange, 
  maxSelections = 5 
}: MediaSelectorProps) {
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getUrls = async () => {
      const urls: Record<string, string> = {};
      
      for (const media of pendingMedia) {
        if (media.file.includes('token=')) {
          urls[media.file] = media.file;
          continue;
        }
        
        try {
          const fileName = media.file.split('/').pop();
          if (!fileName) continue;

          const { data } = await supabase.storage
            .from(process.env.NODE_ENV === 'development' ? 'dev' : 'media')
            .createSignedUrl(fileName, 3600);
            
          if (data?.signedUrl) {
            urls[media.file] = data.signedUrl;
          }
        } catch (error) {
          console.error('Error getting signed URL:', error);
        }
      }
      
      setSignedUrls(urls);
    };

    void getUrls();
  }, [pendingMedia]);

  const handleToggleMedia = (fileUrl: string) => {
    setSelectedMedia(prev => {
      const newSelection = prev.includes(fileUrl)
        ? prev.filter(url => url !== fileUrl)
        : prev.length < maxSelections
          ? [...prev, fileUrl]
          : prev;
      
      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">
        Select media ({selectedMedia.length}/{maxSelections})
      </h3>
      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2">
        {pendingMedia.map((media) => (
          <div 
            key={media.file}
            className={cn(
              "relative aspect-square h-[80px] rounded-lg overflow-hidden border-2",
              selectedMedia.includes(media.file) 
                ? "border-primary" 
                : "border-transparent"
            )}
          >
            {media.fileType === 'video' ? (
              <video
                src={signedUrls[media.file] ?? ''}
                className="w-full h-full object-cover"
                controls={false}
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={signedUrls[media.file] ?? ''}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
            )}
            <div className="absolute top-1 right-1">
              <Checkbox
                checked={selectedMedia.includes(media.file)}
                onCheckedChange={() => handleToggleMedia(media.file)}
                disabled={!selectedMedia.includes(media.file) && selectedMedia.length >= maxSelections}
                className="h-4 w-4 bg-white/90"
              />
            </div>
          </div>
        ))}
      </div>
      {selectedMedia.length >= maxSelections && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxSelections} media items allowed
        </p>
      )}
    </div>
  );
} 