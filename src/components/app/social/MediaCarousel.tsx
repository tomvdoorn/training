import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from '~/utils/supabase';

interface MediaCarouselProps {
  media: Array<{
    fileUrl: string;
    fileType: string;
  }>;
}

export function MediaCarousel({ media }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const getSignedUrls = async () => {
      const urls: Record<string, string> = {};
      
      for (const item of media) {
        if (item.fileUrl.includes('token=')) {
          urls[item.fileUrl] = item.fileUrl;
          continue;
        }
        
        try {
          const fileName = item.fileUrl.split('/').pop();
          if (!fileName) continue;

          const { data } = await supabase.storage
            .from(process.env.NODE_ENV === 'development' ? 'dev' : 'media')
            .createSignedUrl(fileName, 3600);
            
          if (data?.signedUrl) {
            urls[item.fileUrl] = data.signedUrl;
          }
        } catch (error) {
          console.error('Error getting signed URL:', error);
        }
      }
      
      setSignedUrls(urls);
    };

    void getSignedUrls();
  }, [media]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  if (!media.length) return null;

  const currentMedia = media[currentIndex];
  if (!currentMedia) return null;

  return (
    <div className="relative w-full h-full">
      <div className="relative h-full overflow-hidden rounded-lg">
        {currentMedia.fileType === 'video' ? (
          <video
            src={signedUrls[currentMedia.fileUrl] ?? ''}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <Image
            src={signedUrls[currentMedia.fileUrl] ?? ''}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      {media.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-white" 
                    : "bg-white/50"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 