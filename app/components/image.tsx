"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconButton } from "./button";
import { ArrowLeft, ArrowRight, X } from "react-feather";
import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Animate from "./animate";
import { Image as ImageType } from "../types";

interface ImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  buttonClassName?: string;
}

export default function ImageZoom({
  src,
  alt,
  width,
  height,
  className,
  buttonClassName,
}: ImageZoomProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          aria-label="Zoom in on image"
          onClick={() => setOpen(!open)}
          className={`flex cursor-zoom-in not-prose transition-opacity hover:opacity-80 ${buttonClassName}`}
        >
          <Image
            width={width ?? "480"}
            height={height ?? "270"}
            className={className}
            src={src}
            alt={alt}
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow bg-neutral-900/20 backdrop-blur-sm fixed h-[100vh] w-[100vw] inset-0 z-20 cursor-zoom-out" />
        <Dialog.Content className="data-[state=open]:animate-contentShow flex fixed rounded-lg overflow-hidden shadow-lg bg-white dark:bg-neutral-800 z-30 top-[50%] left-[50%] max-h-[90dvh] w-[95vw] h-auto max-w-[1096px] translate-x-[-50%] translate-y-[-50%] focus:outline-none">
          <Image
            src={src}
            alt={alt}
            width={960}
            height={540}
            sizes="100vw"
            className="w-full h-auto object-cover aspect-[16/9]"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ImageZoomGalleryProps {
  images: ImageType[];
}

export function ImageZoomGallery({ images }: ImageZoomGalleryProps) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<ImageType>(images[0]);

  let nextImage: ImageType;
  let previousImage: ImageType;

  const index = images.indexOf(image);

  let notLast = index < images.length - 1;
  let notFirst = index > 0;

  if (notLast) {
    nextImage = images[index + 1];
  }
  if (notFirst) {
    previousImage = images[index - 1];
  }

  function onKeyDown(e: any) {
    if (e.key === "ArrowLeft" && notFirst) {
      setImage(previousImage);
    } else if (e.key === "ArrowRight" && notLast) {
      setImage(nextImage);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <Dialog.Root>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {images.map((image: ImageType, index) => (
          <Dialog.Trigger asChild key={index}>
            <button
              aria-label="Zoom in on image"
              onClick={() => {
                setOpen(!open);
                setImage(image);
              }}
              className="flex w-full cursor-zoom-in transition-opacity hover:opacity-80"
            >
              <Image
                width="256"
                height="144"
                src={image.src}
                alt={image.alt}
                className="rounded-xl w-full h-full object-cover bg-neutral-900/10 dark:bg-neutral-100/10"
              />
            </button>
          </Dialog.Trigger>
        ))}
      </div>
      {image && (
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow bg-neutral-900/20 backdrop-blur-sm h-[100vh] w-[100vw] fixed inset-0 z-20 cursor-zoom-out" />
          <Dialog.Content className="data-[state=open]:animate-contentShow flex fixed rounded-lg overflow-hidden shadow-lg bg-white dark:bg-neutral-800 z-30 top-[50%] left-[50%] max-h-[90dvh] w-[95vw] h-auto max-w-[1096px] translate-x-[-50%] translate-y-[-50%] focus:outline-none">
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
                  onClick={() => setImage(previousImage)}
                  size="medium"
                  disabled={!notFirst}
                >
                  <ArrowLeft size={16} />
                </IconButton>
              </div>
            )}
            {notLast && (
              <div className="fixed right-2 sm:right-4 top-[50%] translate-y-[-50%] z-40">
                <IconButton
                  variant="secondary"
                  label="Next"
                  onClick={() => setImage(nextImage)}
                  size="medium"
                >
                  <ArrowRight size={16} />
                </IconButton>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
