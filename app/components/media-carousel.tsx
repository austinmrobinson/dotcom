"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  companyName?: string;
  pressedArrowKey?: string | null;
  layoutId?: string;
  onViewportClick?: () => void;
  isLightboxOpen?: boolean;
  showControls?: boolean;
  enableSwipe?: boolean;
}

const layoutTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const SWIPE_THRESHOLD_PX = 50;

function MediaViewport({
  media,
  activeIndex,
  onIndexChange,
  onActiveVideoEnded,
  layoutId,
  onViewportClick,
  isLightboxOpen,
  enableSwipe,
  hideAmbientBlur,
}: {
  media: MediaItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onActiveVideoEnded?: () => void;
  layoutId?: string;
  onViewportClick?: () => void;
  isLightboxOpen?: boolean;
  enableSwipe?: boolean;
  hideAmbientBlur?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const isExpandable = !!onViewportClick;
  const sharedLayoutId =
    !prefersReducedMotion && layoutId && !isLightboxOpen ? layoutId : undefined;

  useEffect(() => {
    if (!videoRef.current) return;

    const item = media[activeIndex];
    const video = videoRef.current;
    video.playbackRate = item?.playbackRate ?? 1;
    video.currentTime = 0;
    video.play().catch(() => {});
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

  function handleTouchStart(event: React.TouchEvent) {
    if (!enableSwipe || media.length <= 1) return;
    touchStartX.current = event.touches[0].clientX;
    didSwipe.current = false;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (!enableSwipe || media.length <= 1 || touchStartX.current === null) {
      touchStartX.current = null;
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    didSwipe.current = true;
    if (deltaX > 0) goToPrevious();
    else goToNext();
  }

  function handleViewportClick() {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    onViewportClick?.();
  }

  const viewportClassName = cn(
    "relative aspect-video w-full overflow-hidden rounded-xl border border-border-light bg-overlay-subtle",
    isExpandable && "cursor-zoom-in"
  );

  const mediaContent = (
    <>
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
              {!hideAmbientBlur && (
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
              )}
              <video
                ref={index === activeIndex ? videoRef : undefined}
                src={item.src}
                muted
                playsInline
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
              {!hideAmbientBlur && (
                <Image
                  src={item.src}
                  alt=""
                  fill
                  quality={100}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover blur-2xl scale-200"
                  aria-hidden="true"
                />
              )}
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={100}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority={index === 0}
              />
            </>
          )}
        </div>
      ))}
    </>
  );

  const touchHandlers =
    enableSwipe && media.length > 1
      ? {
          onTouchStart: handleTouchStart,
          onTouchEnd: handleTouchEnd,
        }
      : {};

  if (isExpandable) {
    return (
      <motion.button
        type="button"
        layoutId={sharedLayoutId}
        transition={layoutTransition}
        onClick={handleViewportClick}
        aria-label="Expand preview"
        className={cn(viewportClassName, "block w-full text-left")}
        {...touchHandlers}
      >
        {mediaContent}
      </motion.button>
    );
  }

  if (sharedLayoutId) {
    return (
      <motion.div
        layoutId={sharedLayoutId}
        transition={layoutTransition}
        className={viewportClassName}
        {...touchHandlers}
      >
        {mediaContent}
      </motion.div>
    );
  }

  return (
    <div className={viewportClassName} {...touchHandlers}>
      {mediaContent}
    </div>
  );
}

export function MediaCarousel({
  media,
  activeIndex,
  onIndexChange,
  onActiveVideoEnded,
  pressedArrowKey,
  layoutId,
  onViewportClick,
  isLightboxOpen,
  showControls = true,
  enableSwipe = false,
}: MediaCarouselProps) {
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
      <MediaViewport
        media={media}
        activeIndex={activeIndex}
        onIndexChange={onIndexChange}
        onActiveVideoEnded={onActiveVideoEnded}
        layoutId={layoutId}
        onViewportClick={onViewportClick}
        isLightboxOpen={isLightboxOpen}
        enableSwipe={enableSwipe}
        hideAmbientBlur={isLightboxOpen}
      />

      {showControls && media.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous image"
            className="hidden cursor-pointer lg:block"
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
            className="hidden cursor-pointer lg:block"
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
