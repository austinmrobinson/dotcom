"use client";

import { cn } from "@/app/lib/utils";
import { usePreviewPanelOptional } from "@/app/context/preview-panel-context";

interface LinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  preview?: boolean;
}

export const linkClassName =
  "relative font-medium text-foreground/80 hover:text-foreground hover:before:bg-overlay-light before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded";

export default function AustinLink({
  href,
  children,
  className,
  preview,
}: LinkProps) {
  const panel = usePreviewPanelOptional();

  if (!href) {
    return <button className={cn(linkClassName, className)}>{children}</button>;
  }

  return (
    <a
      href={href}
      className={cn(
        linkClassName,
        preview && panel?.isHrefActive(href) && "text-foreground before:bg-overlay-light",
        className
      )}
      target="_blank"
      onMouseEnter={
        preview && panel ? () => panel.activateHref(href) : undefined
      }
      onMouseLeave={preview && panel ? panel.startDeselectTimer : undefined}
      onFocus={preview && panel ? () => panel.activateHref(href) : undefined}
    >
      {children}
    </a>
  );
}
