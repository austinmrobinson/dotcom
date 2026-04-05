"use client";

import { useEffect, useState, useCallback } from "react";

interface OgMetadata {
  title: string;
  description: string;
  image?: string;
}

const metadataCache = new Map<string, OgMetadata>();
const inflightRequests = new Map<string, Promise<OgMetadata>>();

async function fetchOgMetadata(url: string): Promise<OgMetadata> {
  if (metadataCache.has(url)) {
    return metadataCache.get(url)!;
  }

  if (inflightRequests.has(url)) {
    return inflightRequests.get(url)!;
  }

  const request = fetch(`/api/og?url=${encodeURIComponent(url)}`)
    .then((res) => res.json())
    .then((data: OgMetadata) => {
      metadataCache.set(url, data);
      inflightRequests.delete(url);
      return data;
    })
    .catch(() => {
      inflightRequests.delete(url);
      const fallback: OgMetadata = {
        title: new URL(url).hostname.replace("www.", ""),
        description: "",
      };
      return fallback;
    });

  inflightRequests.set(url, request);
  return request;
}

export function prefetchOgMetadata(urls: string[]) {
  urls.forEach((url) => fetchOgMetadata(url));
}

export function useOgMetadata(url: string | undefined) {
  const [metadata, setMetadata] = useState<OgMetadata | null>(
    url ? metadataCache.get(url) ?? null : null
  );
  const [isLoading, setIsLoading] = useState(!metadata && !!url);

  const load = useCallback(() => {
    if (!url) return;

    const cached = metadataCache.get(url);
    if (cached) {
      setMetadata(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchOgMetadata(url).then((data) => {
      setMetadata(data);
      setIsLoading(false);
    });
  }, [url]);

  useEffect(() => {
    load();
  }, [load]);

  return { metadata, isLoading };
}
