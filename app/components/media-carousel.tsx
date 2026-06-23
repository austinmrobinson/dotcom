"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/app/lib/utils";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

export function Kbd({
  children,
  variant = "default",
  pressed = false,
}: {
  children: React.ReactNode;
  variant?: "default" | "overlay";
  pressed?: boolean;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center size-5 rounded font-sans transition-transform duration-75 [&_svg]:size-3.5",
        pressed && "scale-90",
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
  playbackRate?: number;
}

interface MediaCarouselProps {
  media: MediaItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onActiveVideoEnded?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  companyName?: string;
  pressedArrowKey?: string | null;
}

export function MediaCarousel({
  media,
  activeIndex,
  onIndexChange,
  onActiveVideoEnded,
  onHoverChange,
  pressedArrowKey,
}: MediaCarouselProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const item = media[activeIndex];
      videoRef.current.playbackRate = item?.playbackRate ?? 1;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex, media]);

  function goToPrevious() {
    onIndexChange(
      media.length > 0
        ? (activeIndex - 1 + media.length) % media.length
        : 0
    );
  }

  function goToNext() {
    onIndexChange(
      media.length > 0 ? (activeIndex + 1) % media.length : 0
    );
  }

  function handleActiveVideoEnded() {
    if (media.length <= 1) return;
    onActiveVideoEnded?.();
  }

  if (media.length === 0) {
    return (
      <div
        className="relative aspect-video w-full rounded-xl overflow-hidden border border-border-light bg-overlay-subtle flex items-center justify-center"
        data-preview-target
      >
        <span className="text-muted-foreground text-sm">No media</span>
      </div>
    );
  }

  return (
    <div
      className="flex w-full flex-col gap-3"
      data-preview-target
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border-light bg-overlay-subtle">
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
                  loop
                  playsInline
                  className="absolute inset-0 size-full object-cover blur-2xl scale-200"
                  aria-hidden
                  onLoadedData={(event) => {
                    event.currentTarget.playbackRate = item.playbackRate ?? 1;
                  }}
                />
                <video
                  ref={index === activeIndex ? videoRef : undefined}
                  src={item.src}
                  muted
                  playsInline
                  autoPlay={index === activeIndex}
                  className="relative size-full object-cover"
                  onLoadedData={(event) => {
                    event.currentTarget.playbackRate = item.playbackRate ?? 1;
                  }}
                  onEnded={
                    index === activeIndex ? handleActiveVideoEnded : undefined
                  }
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
                  className="object-cover"
                  priority={index === 0}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous image"
            className="cursor-pointer"
          >
            <Kbd pressed={pressedArrowKey === "ArrowLeft"}>
              <RiArrowLeftSLine />
            </Kbd>
          </button>
          <div className="flex items-center gap-1.5">
            {media.map((_, index) => (
              <button
                key={index}
                type="button"
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
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next image"
            className="cursor-pointer"
          >
            <Kbd pressed={pressedArrowKey === "ArrowRight"}>
              <RiArrowRightSLine />
            </Kbd>
          </button>
        </div>
      )}
    </div>
  );
}
