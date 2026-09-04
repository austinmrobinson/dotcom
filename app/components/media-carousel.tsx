"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";
import { Skeleton } from "@/app/components/ui/skeleton";
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

export interface MediaItem {
  src: string;
  alt: string;
  type: "image" | "video";
  playbackRate?: number;
  poster?: string;
}

interface MediaCarouselProps {
  media: MediaItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onActiveVideoEnded?: () => void;
  companyName?: string;
  pressedArrowKey?: string | null;
}

const carouselImageSizes = "(min-width: 1024px) 60vw, 0vw";

function hasCachedPreview(item: MediaItem) {
  const previewSrc = item.poster ?? (item.type === "image" ? item.src : undefined);
  if (!previewSrc) return false;

  const image = new window.Image();
  image.src = previewSrc;
  return image.complete && image.naturalWidth > 0;
}

function MediaBlur({
  src,
  unoptimized = false,
  onLoad,
}: {
  src: string;
  unoptimized?: boolean;
  onLoad?: () => void;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      quality={60}
      unoptimized={unoptimized}
      sizes={carouselImageSizes}
      className="object-cover blur-2xl scale-200"
      aria-hidden="true"
      onLoad={onLoad}
    />
  );
}

function CarouselVideo({
  item,
  isActive,
  onEnded,
  onReady,
}: {
  item: MediaItem;
  isActive: boolean;
  onEnded?: () => void;
  onReady?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady?.();
  }, [item.src, onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = item.playbackRate ?? 1;

    if (!isActive) {
      video.pause();
      return;
    }

    video.currentTime = 0;
    video.play().catch(() => {});
  }, [isActive, item.playbackRate, item.src]);

  return (
    <video
      ref={videoRef}
      src={item.src}
      poster={item.poster}
      muted
      playsInline
      preload={isActive ? "auto" : "metadata"}
      className="relative size-full object-cover"
      onLoadedData={() => onReady?.()}
      onEnded={isActive ? onEnded : undefined}
    />
  );
}

function MediaSlide({
  item,
  isActive,
  onActiveVideoEnded,
}: {
  item: MediaItem;
  isActive: boolean;
  onActiveVideoEnded?: () => void;
}) {
  const [isReady, setIsReady] = useState(() => hasCachedPreview(item));
  const blurSrc = item.poster ?? (item.type === "image" ? item.src : undefined);
  const markReady = useCallback(() => setIsReady(true), []);

  return (
    <>
      {blurSrc ? (
        <MediaBlur
          src={blurSrc}
          unoptimized={Boolean(item.poster)}
          onLoad={markReady}
        />
      ) : null}
      {item.type === "video" ? (
        <CarouselVideo
          item={item}
          isActive={isActive}
          onEnded={onActiveVideoEnded}
          onReady={markReady}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          quality={100}
          sizes={carouselImageSizes}
          className="object-cover"
          priority={isActive}
          onLoad={markReady}
        />
      )}
      <Skeleton
        aria-hidden={isReady}
        className={cn(
          "absolute inset-0 size-full rounded-none bg-skeleton transition-opacity duration-300",
          isReady ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      />
    </>
  );
}

export function MediaCarousel({
  media,
  activeIndex,
  onIndexChange,
  onActiveVideoEnded,
  pressedArrowKey,
}: MediaCarouselProps) {
  const loadedIndicesRef = useRef(new Set<number>([activeIndex]));
  loadedIndicesRef.current.add(activeIndex);

  useEffect(() => {
    if (media.length <= 1) return;

    const nextItem = media[(activeIndex + 1) % media.length];
    if (!nextItem) return;

    const warmers: Array<HTMLImageElement | HTMLVideoElement> = [];

    if (nextItem.poster) {
      const poster = new window.Image();
      poster.src = nextItem.poster;
      warmers.push(poster);
    }

    if (nextItem.type === "video") {
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "auto";
      video.src = nextItem.src;
      warmers.push(video);
    } else {
      const image = new window.Image();
      image.src = nextItem.src;
      warmers.push(image);
    }

    return () => {
      warmers.forEach((element) => {
        element.src = "";
      });
    };
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
    <div className="flex w-full flex-col gap-3" data-preview-target>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border-light bg-overlay-subtle">
        {media.map((item, index) => {
          const isActive = index === activeIndex;
          const shouldLoad = loadedIndicesRef.current.has(index);

          return (
            <div
              key={item.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              {shouldLoad ? (
                <MediaSlide
                  item={item}
                  isActive={isActive}
                  onActiveVideoEnded={
                    isActive ? handleActiveVideoEnded : undefined
                  }
                />
              ) : null}
            </div>
          );
        })}
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
          <div className="flex items-center justify-center gap-1.5">
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
