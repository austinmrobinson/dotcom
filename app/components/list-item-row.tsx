"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RiArrowRightUpLine } from "@remixicon/react";
import { cn } from "@/app/lib/utils";

export const LIST_HIGHLIGHT_LAYOUT_ID = "list-highlight";

export const listSectionClassName = "relative overflow-visible";

export const listItemRowClassName =
  "relative min-w-0 w-[calc(100%+2rem)] -mx-4 px-4 py-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 before:absolute before:top-0 before:inset-x-4 before:h-px before:bg-border-light before:transition-opacity";

const listItemTextClassName =
  "[&_[data-slot=item-title]]:w-full [&_[data-slot=item-title]]:text-muted-foreground [&_[data-slot=item-description]]:text-muted-foreground [&_.text-muted-foreground]:text-muted-foreground [&_p.text-muted-foreground]:text-muted-foreground [&_[data-slot=item-title]]:transition-colors [&_[data-slot=item-description]]:transition-colors [&_.text-muted-foreground]:transition-colors [&_p.text-muted-foreground]:transition-colors duration-150";

const listItemActiveTextClassName =
  "[&_[data-slot=item-title]]:text-foreground [&_[data-slot=item-description]]:text-text-secondary [&_.text-muted-foreground]:text-text-secondary [&_p.text-muted-foreground]:text-text-secondary";

const highlightTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

function getListItemRowClassName(isHighlighted: boolean, className?: string) {
  return cn(
    listItemRowClassName,
    listItemTextClassName,
    isHighlighted && "before:opacity-0 [&+*]:before:opacity-0",
    isHighlighted && listItemActiveTextClassName,
    className
  );
}

interface ListItemRowProps {
  id: string;
  highlightId: string | null;
  highlightLayoutId: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  children: React.ReactNode;
  className?: string;
}

function ListItemHighlight({ layoutId }: { layoutId: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-x-0 inset-y-0 z-0 rounded-lg bg-overlay-light" />
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={highlightTransition}
      className="absolute inset-x-0 inset-y-0 z-0 rounded-lg bg-overlay-light"
    />
  );
}

function ListItemHighlightLayer({
  isHighlighted,
  highlightLayoutId,
}: {
  isHighlighted: boolean;
  highlightLayoutId: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {isHighlighted && (
        <ListItemHighlight layoutId={highlightLayoutId} />
      )}
    </AnimatePresence>
  );
}

function ListItemRowBase({
  id,
  highlightId,
  highlightLayoutId,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  children,
  className,
  ...props
}: ListItemRowProps & React.ComponentPropsWithoutRef<"div">) {
  const isHighlighted = highlightId === id;

  return (
    <div
      {...props}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      className={getListItemRowClassName(isHighlighted, className)}
    >
      <ListItemHighlightLayer
        isHighlighted={isHighlighted}
        highlightLayoutId={highlightLayoutId}
      />
      <div className="relative z-10 w-full min-w-0">{children}</div>
    </div>
  );
}

export function ListItemRow({
  ...props
}: ListItemRowProps & React.ComponentPropsWithoutRef<"div">) {
  return <ListItemRowBase {...props} />;
}

export function ListItemRowLink({
  href,
  target = "_blank",
  ...props
}: ListItemRowProps & { href: string; target?: string }) {
  const {
    id,
    highlightId,
    highlightLayoutId,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    children,
    className,
  } = props;
  const isHighlighted = highlightId === id;

  return (
    <a
      href={href}
      target={target}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      className={getListItemRowClassName(isHighlighted, className)}
    >
      <ListItemHighlightLayer
        isHighlighted={isHighlighted}
        highlightLayoutId={highlightLayoutId}
      />
      <div className="relative z-10 w-full min-w-0">{children}</div>
    </a>
  );
}

export function ListItemRowButton({
  type = "button",
  onClick,
  ...props
}: ListItemRowProps & {
  type?: "button";
  onClick?: () => void;
}) {
  const {
    id,
    highlightId,
    highlightLayoutId,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    children,
    className,
  } = props;
  const isHighlighted = highlightId === id;

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      className={getListItemRowClassName(isHighlighted, cn("cursor-pointer", className))}
    >
      <ListItemHighlightLayer
        isHighlighted={isHighlighted}
        highlightLayoutId={highlightLayoutId}
      />
      <div className="relative z-10 w-full min-w-0">{children}</div>
    </button>
  );
}

export function getListHighlightId(
  panel: { type: string; workIndex?: number; id?: string } | null
): string | null {
  if (!panel) return null;
  if (panel.type === "media" && panel.workIndex !== undefined) {
    return `work-${panel.workIndex}`;
  }
  if (panel.type === "profile" && panel.id) {
    return `contact-${panel.id}`;
  }
  return null;
}

export function ListItemTrailing({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const motionState = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, filter: "blur(4px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(4px)" },
      };

  return (
    <div className={cn("relative shrink-0", className)}>
      <span className="invisible block whitespace-nowrap" aria-hidden>
        {children}
      </span>
      <div className="absolute inset-0 flex items-center justify-end">
        <AnimatePresence mode="popLayout" initial={false}>
          {active ? (
            <motion.span
              key="trailing-icon"
              {...motionState}
              transition={{ duration: 0.15 }}
              className="flex items-center text-muted-foreground"
              aria-hidden
            >
              <RiArrowRightUpLine className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="trailing-text"
              {...motionState}
              transition={{ duration: 0.15 }}
              className="block whitespace-nowrap text-muted-foreground"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
