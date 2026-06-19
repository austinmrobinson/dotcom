"use client";

import { useOgMetadata } from "@/app/hooks/use-og-metadata";
import { cn } from "@/app/lib/utils";

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function getFavicon(url: string) {
  try {
    return `${new URL(url).origin}/favicon.ico`;
  } catch {
    return undefined;
  }
}

interface PreviewCardProps {
  href?: string;
  title?: string;
  description?: string;
  image?: string;
}

export function PreviewCard({
  href,
  title,
  description,
  image,
}: PreviewCardProps) {
  const { metadata, isLoading } = useOgMetadata(href);

  const displayTitle = title ?? metadata?.title ?? "";
  const displayDescription = description ?? metadata?.description ?? "";
  const displayImage = image ?? metadata?.image;
  const isLoadingOg = Boolean(href) && isLoading && !title;

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border-light bg-overlay-subtle">
      {isLoadingOg ? (
        <div className="absolute inset-0 animate-pulse bg-skeleton" />
      ) : (
        <>
          {displayImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-overlay-subtle to-overlay-light" />
          )}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5",
              displayImage ? "text-white" : "text-foreground"
            )}
          >
            {href && (
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
                <span
                  className={cn(
                    "text-xs",
                    displayImage ? "text-white/70" : "text-muted-foreground"
                  )}
                >
                  {getDomain(href)}
                </span>
              </div>
            )}
            {displayTitle && (
              <span className="text-lg font-medium leading-snug">
                {displayTitle}
              </span>
            )}
            {displayDescription && (
              <span
                className={cn(
                  "text-sm leading-relaxed line-clamp-2",
                  displayImage ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {displayDescription}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
