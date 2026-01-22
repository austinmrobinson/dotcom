"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { IconButton } from "@/app/components/ui/button";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageType } from "../types";

interface ImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  buttonClassName?: string;
  priority?: boolean;
}

export default function ImageZoom({
  src,
  alt,
  width,
  height,
  className,
  buttonClassName,
  priority,
}: ImageZoomProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Zoom in on image"
          className={`flex cursor-zoom-in not-prose transition-opacity hover:opacity-70 ${buttonClassName}`}
        >
          <Image
            width={width ?? 480}
            height={height ?? 270}
            className={className}
            src={src}
            alt={alt}
            priority={priority}
          />
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="data-[state=open]:animate-overlayShow bg-neutral-900/20 backdrop-blur-sm cursor-zoom-out" />
        <DialogContent
          showCloseButton={false}
          className="data-[state=open]:animate-contentShow flex rounded-lg overflow-hidden shadow-lg bg-white dark:bg-neutral-800 p-0 border-0 max-h-[90dvh] w-[95vw] h-auto max-w-[1096px]"
        >
          <Image
            src={src}
            alt={alt}
            width={960}
            height={540}
            sizes="100vw"
            className="w-full h-auto object-cover aspect-[16/9]"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

interface ImageZoomGalleryProps {
  images: ImageType[];
}

export function ImageZoomGallery({ images }: ImageZoomGalleryProps) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<ImageType>(images[0]);

  const index = images.indexOf(image);
  const notLast = index < images.length - 1;
  const notFirst = index > 0;
  const nextImage = notLast ? images[index + 1] : null;
  const previousImage = notFirst ? images[index - 1] : null;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && previousImage) {
        setImage(previousImage);
      } else if (e.key === "ArrowRight" && nextImage) {
        setImage(nextImage);
      }
    },
    [previousImage, nextImage]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {images.map((img: ImageType, idx) => (
          <DialogTrigger asChild key={idx}>
            <button
              aria-label="Zoom in on image"
              onClick={() => {
                setImage(img);
              }}
              className="flex w-full cursor-zoom-in transition-opacity hover:opacity-80"
            >
              <Image
                width={256}
                height={144}
                src={img.src}
                alt={img.alt}
                className="rounded-xl w-full h-full object-cover m-0 bg-neutral-900/10 dark:bg-neutral-100/10 border border-neutral-200/[0.005] dark:border-white/[0.005]"
              />
            </button>
          </DialogTrigger>
        ))}
      </div>
      {image && (
        <DialogPortal>
          <DialogOverlay className="data-[state=open]:animate-overlayShow bg-neutral-900/20 backdrop-blur-sm cursor-zoom-out" />
          <DialogContent
            showCloseButton={false}
            className="data-[state=open]:animate-contentShow flex rounded-lg overflow-hidden shadow-lg bg-white dark:bg-neutral-800 p-0 border-0 max-h-[90dvh] w-[95vw] h-auto max-w-[1096px]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={960}
              height={540}
              sizes="100vw"
              className="w-full h-auto object-cover aspect-[16/9]"
            />
            {notFirst && (
              <div className="fixed left-2 sm:left-4 top-[50%] translate-y-[-50%] z-40">
                <IconButton
                  variant="secondary"
                  label="Previous"
                  onClick={() => previousImage && setImage(previousImage)}
                  size="medium"
                  disabled={!notFirst}
                >
                  <IconArrowLeft size={16} stroke={1.5} />
                </IconButton>
              </div>
            )}
            {notLast && (
              <div className="fixed right-2 sm:right-4 top-[50%] translate-y-[-50%] z-40">
                <IconButton
                  variant="secondary"
                  label="Next"
                  onClick={() => nextImage && setImage(nextImage)}
                  size="medium"
                >
                  <IconArrowRight size={16} stroke={1.5} />
                </IconButton>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      )}
    </Dialog>
  );
}
