"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/app/lib/utils";
import { RiArrowUpSLine, RiArrowDownSLine, RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

export function Kbd({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "overlay";
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center size-5 rounded font-sans [&_svg]:size-3.5",
        variant === "overlay"
          ? "border border-foreground/10 bg-foreground/80 text-background backdrop-blur-sm"
          : "border border-border-light bg-overlay-subtle text-muted-foreground/80"
      )}
    >
      {children}
    </kbd>
  );
}

interface MediaItem {
  src: string;
  alt: string;
  type: "image" | "video";
}

interface MediaCarouselProps {
  media: MediaItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  companyName?: string;
}

export function MediaCarousel({
  media,
  activeIndex,
  onIndexChange,
  companyName,
}: MediaCarouselProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  if (media.length === 0) {
    return (
      <div className="relative size-full rounded-xl overflow-hidden border border-border-light bg-overlay-subtle flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No media</span>
      </div>
    );
  }

  return (
    <div className="relative h-full rounded-xl overflow-hidden border border-border-light bg-overlay-subtle">
      {media.map((item, index) => (
        <div
          key={item.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-out",
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {item.type === "video" ? (
            <>
              <video
                src={item.src}
                muted
                playsInline
                className="absolute inset-0 size-full object-cover blur-2xl scale-200"
                aria-hidden
              />
              <video
                ref={index === activeIndex ? videoRef : undefined}
                src={item.src}
                muted
                loop
                playsInline
                autoPlay={index === activeIndex}
                className="relative size-full object-contain"
              />
            </>
          ) : (
            <>
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 0vw"
                className="object-cover blur-2xl scale-200"
                aria-hidden="true"
              />
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 0vw"
                className="object-contain"
                priority={index === 0}
              />
            </>
          )}
        </div>
      ))}

      {media.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-3 px-4 py-4">
          <Kbd variant="overlay"><RiArrowLeftSLine /></Kbd>
          <div className="flex items-center gap-1.5">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-200 cursor-pointer",
                  index === activeIndex
                    ? "bg-foreground/60"
                    : "bg-foreground/15 hover:bg-foreground/30"
                )}
                aria-label={`View image ${index + 1} of ${media.length}`}
              />
            ))}
          </div>
          <Kbd variant="overlay"><RiArrowRightSLine /></Kbd>
        </div>
      )}
    </div>
  );
}
