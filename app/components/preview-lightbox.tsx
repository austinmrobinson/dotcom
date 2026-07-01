"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { cn } from "@/app/lib/utils";

export const PREVIEW_MEDIA_LAYOUT_ID = "preview-media-viewport";

export function getPreviewProfileLayoutId(id: string) {
  return `preview-profile-${id}`;
}

const layoutTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

interface PreviewLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layoutId?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PreviewLightbox({
  open,
  onOpenChange,
  layoutId,
  title,
  children,
  className,
}: PreviewLightboxProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPortal>
            <DialogOverlay className="data-[state=open]:animate-overlayShow bg-overlay-strong cursor-zoom-out" />
            <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={prefersReducedMotion ? undefined : layoutId}
                transition={layoutTransition}
                className={cn(
                  "pointer-events-auto w-full max-w-5xl overflow-hidden",
                  className
                )}
              >
                <DialogTitle className="sr-only">{title}</DialogTitle>
                {children}
              </motion.div>
            </div>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
