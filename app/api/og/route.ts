import { NextRequest, NextResponse } from "next/server";

interface OgData {
  title: string;
  description: string;
  image?: string;
}

const FALLBACKS: Record<string, OgData> = {
  "tesla.com": {
    title: "Tesla",
    description: "Accelerating the world's transition to sustainable energy.",
  },
};

function getFallback(url: string): OgData | null {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return FALLBACKS[hostname] ?? null;
  } catch {
    return null;
  }
}

const cache = new Map<string, OgData>();

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (cache.has(url)) {
    return NextResponse.json(cache.get(url));
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });

    const html = await response.text();

    const title =
      extractMeta(html, "og:title") ??
      extractMeta(html, "twitter:title") ??
      extractTag(html, "title") ??
      new URL(url).hostname;

    const description =
      extractMeta(html, "og:description") ??
      extractMeta(html, "twitter:description") ??
      extractMeta(html, "description") ??
      "";

    const image =
      extractMeta(html, "og:image") ??
      extractMeta(html, "twitter:image") ??
      undefined;

    const looksLikeError =
      /access denied|forbidden|blocked|error/i.test(title) ||
      /access denied|forbidden|blocked/i.test(description);

    const fallback = getFallback(url);
    const result = looksLikeError && fallback ? fallback : { title, description, image };

    cache.set(url, result);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    });
  } catch {
    const fallback = getFallback(url) ?? {
      title: new URL(url).hostname.replace("www.", ""),
      description: "",
    };
    return NextResponse.json(fallback);
  }
}

function extractMeta(html: string, property: string): string | null {
  const nameMatch = html.match(
    new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, "i")
  );
  if (nameMatch) return decodeEntities(nameMatch[1]);

  const reversedMatch = html.match(
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`, "i")
  );
  if (reversedMatch) return decodeEntities(reversedMatch[1]);

  return null;
}

function extractTag(html: string, tag: string): string | null {
  const match = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i"));
  return match ? decodeEntities(match[1].trim()) : null;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}
