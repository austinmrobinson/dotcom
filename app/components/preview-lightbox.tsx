"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogPortal,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { cn } from "@/app/lib/utils";

export const PREVIEW_MEDIA_LAYOUT_ID = "preview-media-viewport";

export function getPreviewMediaLayoutId(workIndex: number) {
  return `${PREVIEW_MEDIA_LAYOUT_ID}-${workIndex}`;
}

export function getPreviewProfileLayoutId(id: string) {
  return `preview-profile-${id}`;
}

export const previewLayoutTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.85,
};

interface PreviewLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PreviewLightbox({
  open,
  onOpenChange,
  title,
  children,
  className,
}: PreviewLightboxProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPresent, setIsPresent] = useState(open);

  useEffect(() => {
    if (open) setIsPresent(true);
  }, [open]);

  return (
    <Dialog
      open={isPresent}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onOpenChange(false);
      }}
    >
      <DialogPortal>
        <AnimatePresence
          onExitComplete={() => {
            if (!open) setIsPresent(false);
          }}
        >
          {open && (
            <motion.div
              key="preview-lightbox"
              className="fixed inset-0 z-50"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.12 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                aria-hidden
                data-slot="dialog-overlay"
                className="absolute inset-0 bg-overlay-strong cursor-zoom-out"
                onClick={() => onOpenChange(false)}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                <div
                  className={cn(
                    "pointer-events-auto w-full max-w-5xl [filter:none]",
                    className
                  )}
                >
                  <DialogTitle className="sr-only">{title}</DialogTitle>
                  {children}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
}
