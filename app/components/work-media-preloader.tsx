"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MediaItem } from "./media-carousel";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

interface WorkMediaPreloaderProps {
  groups: MediaItem[][];
}

function getFirstItems(groups: MediaItem[][]) {
  return groups.map((group) => group[0]).filter((item): item is MediaItem => Boolean(item));
}

function getRestItems(groups: MediaItem[][]) {
  return groups.flatMap((group) => group.slice(1));
}

function preloadResource(href: string, as: "image" | "video", fetchPriority: "high" | "low") {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = as;
  link.href = href;
  link.setAttribute("fetchpriority", fetchPriority);
  document.head.appendChild(link);
  return link;
}

export function WorkMediaPreloader({ groups }: WorkMediaPreloaderProps) {
  const [shouldWarm, setShouldWarm] = useState(false);
  const [shouldWarmRest, setShouldWarmRest] = useState(false);

  useEffect(() => {
    if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return;

    const firstItems = getFirstItems(groups);
    const links = firstItems.flatMap((item, index) => {
      const fetchPriority = index === 0 ? "high" : "low";
      const created: HTMLLinkElement[] = [];

      if (item.poster) {
        created.push(preloadResource(item.poster, "image", fetchPriority));
      }

      created.push(
        preloadResource(
          item.src,
          item.type === "video" ? "video" : "image",
          fetchPriority
        )
      );

      return created;
    });

    setShouldWarm(true);

    let idleId: number;
    let cancelIdle: () => void;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => setShouldWarmRest(true));
      cancelIdle = () => window.cancelIdleCallback(idleId);
    } else {
      idleId = window.setTimeout(() => setShouldWarmRest(true), 1200);
      cancelIdle = () => window.clearTimeout(idleId);
    }

    return () => {
      links.forEach((link) => link.remove());
      cancelIdle();
    };
  }, [groups]);

  if (!shouldWarm) return null;

  const items = shouldWarmRest
    ? [...getFirstItems(groups), ...getRestItems(groups)]
    : getFirstItems(groups);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 size-px overflow-hidden opacity-0"
    >
      {items.map((item) =>
        item.type === "video" ? (
          <div key={item.src}>
            {item.poster ? (
              // Native poster URLs are not optimized by next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.poster} alt="" />
            ) : null}
            <video src={item.src} muted playsInline preload="auto" />
          </div>
        ) : (
          <Image
            key={item.src}
            src={item.src}
            alt=""
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 60vw, 0vw"
            quality={100}
            priority={getFirstItems(groups).some((first) => first.src === item.src)}
          />
        )
      )}
    </div>
  );
}
