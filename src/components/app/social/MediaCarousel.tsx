import { useState } from 'react';
import Image from 'next/image';
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaUrls } from '~/hooks/useMediaUrls';

interface MediaCarouselProps {
    media: Array<{
        fileUrl: string;
        fileType: string;
    }>;
}

export function MediaCarousel({ media }: MediaCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use our consistent URL handling hook
    const urls = useMediaUrls(media.map(item => item.fileUrl));

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    if (!media.length) return null;

    const currentMedia = media[currentIndex];
    if (!currentMedia) return null;

    // Show loading state while URLs are being fetched
    const isLoading = Object.keys(urls).length === 0 && media.length > 0;
    if (isLoading) {
        return (
            <div className="relative w-full h-full bg-gray-100 animate-pulse rounded-lg" />
        );
    }

    return (
        <div className="relative w-full h-full">
            <div className="relative h-full overflow-hidden rounded-lg">
                {currentMedia.fileType === 'video' ? (
                    <video
                        src={urls[currentMedia.fileUrl] ?? ''}
                        className="w-full h-full object-cover"
                        controls
                        onError={(e) => {
                            console.error('Video load error:', e);
                        }}
                    />
                ) : (
                    <Image
                        src={urls[currentMedia.fileUrl] ?? ''}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                            console.error('Image load error:', e);
                        }}
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