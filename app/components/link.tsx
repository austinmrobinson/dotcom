"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useOgMetadata } from "@/app/hooks/use-og-metadata";

interface LinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  preview?: boolean;
}

const linkClassName =
  "relative font-medium text-foreground/80 hover:text-foreground hover:before:bg-overlay-light before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded";

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function getFavicon(url: string) {
  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch {
    return undefined;
  }
}

function PreviewSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 animate-pulse">
      <div className="h-3 w-20 rounded bg-skeleton" />
      <div className="h-3.5 w-36 rounded bg-skeleton" />
      <div className="flex flex-col gap-1">
        <div className="h-3 w-full rounded bg-skeleton" />
        <div className="h-3 w-3/4 rounded bg-skeleton" />
      </div>
    </div>
  );
}

function PreviewContent({ href }: { href: string }) {
  const { metadata, isLoading } = useOgMetadata(href);

  if (isLoading || !metadata) {
    return <PreviewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getFavicon(href)}
          alt=""
          className="size-3.5 rounded-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="text-xs text-muted-foreground">{getDomain(href)}</span>
      </div>
      <span className="text-sm font-medium text-foreground leading-snug">
        {metadata.title}
      </span>
      {metadata.description && (
        <span className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {metadata.description}
        </span>
      )}
    </div>
  );
}

export default function AustinLink({
  href,
  children,
  preview,
}: LinkProps) {
  if (!href) {
    return <button className={linkClassName}>{children}</button>;
  }

  const anchor = (
    <a href={href} className={linkClassName} target="_blank">
      {children}
    </a>
  );

  if (!preview) return anchor;

  return (
    <TooltipPrimitive.Root delay={300}>
      <TooltipPrimitive.Trigger render={anchor} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          side="top"
          sideOffset={8}
          className="isolate z-50"
        >
          <TooltipPrimitive.Popup className="origin-(--transform-origin) w-64 rounded-xl border border-border-light bg-surface-elevated p-3 shadow-lg data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2">
            <PreviewContent href={href} />
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
