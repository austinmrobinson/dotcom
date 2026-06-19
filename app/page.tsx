"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { LayoutGroup, useReducedMotion } from "framer-motion";
import { Text } from "./components/text";
import AustinLink from "./components/link";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/app/components/ui/item";
import { MediaCarousel, Kbd } from "./components/media-carousel";
import { ProfileCard } from "./components/profile-card";
import { RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react";
import { MouseSafeArea } from "./components/mouse-safe-area";
import {
  ListItemRow,
  ListItemRowLink,
  ListItemRowButton,
  ListItemTrailing,
  getListHighlightId,
  listSectionClassName,
  LIST_HIGHLIGHT_LAYOUT_ID,
} from "./components/list-item-row";
import { HomeEnterSection } from "./components/home-enter";
import {
  PreviewPanelContext,
  type PanelContent,
  type PreviewPanelContextValue,
  type ProfilePanelContent,
} from "./context/preview-panel-context";
import { prefetchOgMetadata } from "./hooks/use-og-metadata";
import { cn } from "@/app/lib/utils";

const DESELECT_DELAY = 400;
const AUTO_ADVANCE_MS = 4000;
const MANUAL_PAUSE_MS = 8000;

const contactProfiles = {
  twitter: {
    id: "twitter",
    platform: "twitter",
    href: "https://twitter.com/austinmrobinson",
    name: "Austin Robinson",
    handle: "@austinmrobinson",
    avatar: "/austin.jpg",
    verified: true,
  },
  linkedin: {
    id: "linkedin",
    platform: "linkedin",
    href: "https://www.linkedin.com/in/robinsonaustin/",
    name: "Austin Robinson",
    handle: "robinsonaustin",
    avatar: "/austin.jpg",
  },
  email: {
    id: "email",
    platform: "email",
    name: "Austin Robinson",
    handle: "austinrobinsondesign@gmail.com",
    avatar: "/austin.jpg",
    bannerClassName: "bg-neutral-700",
  },
} satisfies Record<string, Omit<ProfilePanelContent, "type">>;

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

interface MediaItem {
  src: string;
  alt: string;
  type: "image" | "video";
}

interface WorkEntryProps {
  company: string;
  href: string;
  role: string;
  dateRange: string;
  description: string;
  media?: MediaItem[];
}

interface WorkEntryComponentProps extends WorkEntryProps {
  itemId: string;
  highlightId: string | null;
  onHover?: () => void;
}

function WorkEntry({
  company,
  role,
  dateRange,
  description,
  itemId,
  highlightId,
  onHover,
}: WorkEntryComponentProps) {
  return (
    <ListItemRow
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      role="listitem"
      className="flex flex-col gap-3"
      onMouseEnter={onHover}
    >
      <Item className="px-0 py-0 w-full min-w-0 flex-nowrap items-start justify-between">
        <ItemContent className="min-w-0">
          <ItemTitle className="w-full">{company}</ItemTitle>
          <ItemDescription>{role}</ItemDescription>
        </ItemContent>
        <ItemActions className="mt-0.5">
          <span className="tabular-nums text-muted-foreground whitespace-nowrap">
            {dateRange}
          </span>
        </ItemActions>
      </Item>
      <Text className="text-pretty">{description}</Text>
    </ListItemRow>
  );
}

interface ContactEntryProps {
  itemId: string;
  href: string;
  title: string;
  trailing: string;
  highlightId: string | null;
  onHover?: () => void;
}

function ContactEntry({
  itemId,
  href,
  title,
  trailing,
  highlightId,
  onHover,
}: ContactEntryProps) {
  return (
    <ListItemRowLink
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      href={href}
      onMouseEnter={onHover}
      onFocus={onHover}
    >
      <Item className="px-0 py-0 w-full min-w-0 flex-nowrap items-center justify-between">
        <ItemContent className="min-w-0">
          <ItemTitle className="w-full">{title}</ItemTitle>
        </ItemContent>
        <ListItemTrailing active={highlightId === itemId}>
          {trailing}
        </ListItemTrailing>
      </Item>
    </ListItemRowLink>
  );
}

function CopyEmailButton({
  email,
  itemId,
  highlightId,
  onHover,
}: {
  email: string;
  itemId: string;
  highlightId: string | null;
  onHover?: () => void;
}) {
  const [, copy] = useCopyToClipboard();

  return (
    <ListItemRowButton
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      onClick={() => {
        copy(email)
          .then(() => toast.success("Copied Email"))
          .catch(() => toast.error("Failed to copy"));
      }}
      onMouseEnter={onHover}
      onFocus={onHover}
    >
      <Item className="px-0 py-0 w-full min-w-0 flex-nowrap items-center justify-between">
        <ItemContent className="min-w-0">
          <ItemTitle className="w-full">Email</ItemTitle>
        </ItemContent>
        <ListItemTrailing active={highlightId === itemId}>
          {email}
        </ListItemTrailing>
      </Item>
    </ListItemRowButton>
  );
}

const workEntries: WorkEntryProps[] = [
  {
    company: "Nominal",
    href: "https://nominal.io",
    role: "Designer",
    dateRange: "2024 — Present",
    description:
      "Building out the design team across product, web, and brand.",
    media: [
      { src: "/placeholder-image.jpg", alt: "Nominal product work", type: "image" },
    ],
  },
  {
    company: "Tesla",
    href: "https://tesla.com",
    role: "Design System Lead",
    dateRange: "2021 — 2024",
    description:
      "Unified the visual style across all platforms and products.",
    media: [
      { src: "/projects/tds-website/tds-website_01.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_02.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_03.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_04.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_05.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_06.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_07.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_08.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_09.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_10.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_11.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_12.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_13.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_14.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_15.mp4", alt: "Tesla Design System website demo", type: "video" },
      { src: "/projects/tds-website/tds-website_16.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_17.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/tds-website/tds-website_18.jpg", alt: "Tesla Design System website", type: "image" },
      { src: "/projects/cross-platform-color/cross-platform-color_01.jpg", alt: "Cross-platform color system", type: "image" },
      { src: "/projects/cross-platform-color/cross-platform-color_03.jpg", alt: "Cross-platform color alignment", type: "image" },
      { src: "/projects/cross-platform-color/cross-platform-color_06.jpg", alt: "Cross-platform color tokens", type: "image" },
      { src: "/projects/tesla-os-navigation/tesla-os-navigation_01.jpg", alt: "Tesla OS navigation", type: "image" },
      { src: "/projects/tesla-os-navigation/tesla-os-navigation_03.jpg", alt: "Tesla OS navigation patterns", type: "image" },
      { src: "/projects/tesla-os-navigation/tesla-os-navigation_07.mp4", alt: "Tesla OS navigation demo", type: "video" },
    ],
  },
  {
    company: "Paper Crowns",
    href: "https://papercrowns.com",
    role: "Front-End Engineer",
    dateRange: "2020 — Present",
    description:
      "Shipped websites for Activision Blizzard (Call of Duty, Overwatch), Supercell, and more.",
    media: [
      { src: "/placeholder-image.jpg", alt: "Paper Crowns client work", type: "image" },
    ],
  },
  {
    company: "HP",
    href: "https://hp.com",
    role: "Designer, Design Systems",
    dateRange: "2017 — 2021",
    description:
      "Scaled the design system across organizations and platforms.",
    media: [
      { src: "/placeholder-image.jpg", alt: "HP design system work", type: "image" },
    ],
  },
];

function findWorkIndexByHref(href: string) {
  const normalized = normalizeUrl(href);
  return workEntries.findIndex(
    (entry) => normalizeUrl(entry.href) === normalized
  );
}

function usePreviewPanel(): PreviewPanelContextValue {
  const prefersReducedMotion = useReducedMotion();
  const [panel, setPanel] = useState<PanelContent | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const deselectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const manualPauseUntil = useRef<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeMedia =
    panel?.type === "media"
      ? workEntries[panel.workIndex]?.media ?? []
      : [];

  const clearDeselectTimer = useCallback(() => {
    if (deselectTimer.current) {
      clearTimeout(deselectTimer.current);
      deselectTimer.current = null;
    }
  }, []);

  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearInterval(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  const pauseAutoAdvance = useCallback(() => {
    manualPauseUntil.current = Date.now() + MANUAL_PAUSE_MS;
    clearAutoAdvanceTimer();
  }, [clearAutoAdvanceTimer]);

  const startDeselectTimer = useCallback(() => {
    clearDeselectTimer();
    deselectTimer.current = setTimeout(() => {
      setPanel(null);
      setMediaIndex(0);
    }, DESELECT_DELAY);
  }, [clearDeselectTimer]);

  const activateWork = useCallback(
    (index: number) => {
      clearDeselectTimer();
      manualPauseUntil.current = 0;
      setPanel({ type: "media", workIndex: index });
      setMediaIndex(0);
    },
    [clearDeselectTimer]
  );

  const activateHref = useCallback(
    (href: string) => {
      clearDeselectTimer();
      manualPauseUntil.current = 0;
      const workIndex = findWorkIndexByHref(href);
      if (workIndex >= 0) {
        setPanel({ type: "media", workIndex });
      } else {
        setPanel({ type: "og", href });
      }
      setMediaIndex(0);
    },
    [clearDeselectTimer]
  );

  const activateProfile = useCallback(
    (content: Omit<ProfilePanelContent, "type">) => {
      clearDeselectTimer();
      manualPauseUntil.current = 0;
      setPanel({ type: "profile", ...content });
      setMediaIndex(0);
    },
    [clearDeselectTimer]
  );

  const handleMediaIndexChange = useCallback(
    (index: number) => {
      pauseAutoAdvance();
      setMediaIndex(index);
    },
    [pauseAutoAdvance]
  );

  const isWorkActive = useCallback(
    (index: number) => panel?.type === "media" && panel.workIndex === index,
    [panel]
  );

  const isHrefActive = useCallback(
    (href: string) => {
      if (!panel) return false;
      const normalized = normalizeUrl(href);
      if (panel.type === "profile" && panel.href) {
        return normalizeUrl(panel.href) === normalized;
      }
      if (panel.type === "media") {
        return normalizeUrl(workEntries[panel.workIndex]?.href ?? "") === normalized;
      }
      return false;
    },
    [panel]
  );

  const isProfileActive = useCallback(
    (id: string) => panel?.type === "profile" && panel.id === id,
    [panel]
  );

  useEffect(() => {
    return () => clearDeselectTimer();
  }, [clearDeselectTimer]);

  useEffect(() => {
    clearAutoAdvanceTimer();

    if (
      prefersReducedMotion ||
      panel?.type !== "media" ||
      activeMedia.length <= 1
    ) {
      return;
    }

    autoAdvanceTimer.current = setInterval(() => {
      if (Date.now() < manualPauseUntil.current) return;

      setMediaIndex((prev) =>
        activeMedia.length > 0 ? (prev + 1) % activeMedia.length : 0
      );
    }, AUTO_ADVANCE_MS);

    return clearAutoAdvanceTimer;
  }, [
    panel,
    activeMedia.length,
    prefersReducedMotion,
    clearAutoAdvanceTimer,
  ]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (panel?.type !== "media") return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        clearDeselectTimer();
        manualPauseUntil.current = 0;
        setPanel((prev) => {
          if (prev?.type !== "media") return prev;
          const next = (prev.workIndex + 1) % workEntries.length;
          setMediaIndex(0);
          return { type: "media", workIndex: next };
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        clearDeselectTimer();
        manualPauseUntil.current = 0;
        setPanel((prev) => {
          if (prev?.type !== "media") return prev;
          const next =
            (prev.workIndex - 1 + workEntries.length) % workEntries.length;
          setMediaIndex(0);
          return { type: "media", workIndex: next };
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        pauseAutoAdvance();
        setMediaIndex((prev) =>
          activeMedia.length > 0 ? (prev + 1) % activeMedia.length : 0
        );
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        pauseAutoAdvance();
        setMediaIndex((prev) =>
          activeMedia.length > 0
            ? (prev - 1 + activeMedia.length) % activeMedia.length
            : 0
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    panel,
    activeMedia.length,
    clearDeselectTimer,
    pauseAutoAdvance,
  ]);

  return {
    panel,
    mediaIndex,
    carouselRef,
    activateWork,
    activateHref,
    activateProfile,
    setMediaIndex: handleMediaIndexChange,
    clearDeselectTimer,
    startDeselectTimer,
    isWorkActive,
    isHrefActive,
    isProfileActive,
  };
}

function PreviewPanel({
  panel,
  mediaIndex,
  onMediaIndexChange,
}: {
  panel: PanelContent;
  mediaIndex: number;
  onMediaIndexChange: (index: number) => void;
}) {
  if (panel.type === "media") {
    return (
      <div className="aspect-video w-full min-w-0">
        <MediaCarousel
          media={workEntries[panel.workIndex]?.media ?? []}
          activeIndex={mediaIndex}
          onIndexChange={onMediaIndexChange}
          companyName={workEntries[panel.workIndex]?.company}
        />
      </div>
    );
  }

  if (panel.type === "profile") {
    const isSocial =
      panel.platform === "twitter" || panel.platform === "linkedin";

    return (
      <div
        className={
          isSocial
            ? "flex aspect-video w-full min-w-0 items-center justify-center overflow-visible rounded-xl bg-profile-preview"
            : "aspect-video w-full min-w-0"
        }
      >
        <ProfileCard
          platform={panel.platform}
          name={panel.name}
          handle={panel.handle}
          avatar={panel.avatar}
          banner={panel.banner}
          bannerClassName={panel.bannerClassName}
          verified={panel.verified}
        />
      </div>
    );
  }

  return null;
}

export default function Home() {
  const previewPanel = usePreviewPanel();
  const [hoveredListItemId, setHoveredListItemId] = useState<string | null>(null);

  const highlightId =
    hoveredListItemId ?? getListHighlightId(previewPanel.panel);

  function handleListItemHover(id: string, activate: () => void) {
    setHoveredListItemId(id);
    activate();
  }

  function handleListSectionLeave() {
    setHoveredListItemId(null);
    previewPanel.startDeselectTimer();
  }

  useEffect(() => {
    prefetchOgMetadata(workEntries.map((entry) => entry.href));
  }, []);

  const contextValue = useMemo(
    () => previewPanel,
    [previewPanel]
  );

  return (
    <PreviewPanelContext.Provider value={contextValue}>
      <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">
        <div className="relative flex flex-col gap-14 sm:gap-16 w-full lg:w-[38.2%] lg:min-w-80 shrink-0 lg:shrink">
          {previewPanel.panel && (
            <MouseSafeArea parentRef={previewPanel.carouselRef} />
          )}

          <section
            id="introduction"
            className="flex flex-col gap-4 justify-start"
          >
            <HomeEnterSection index={0}>
              <div className="flex items-center gap-3">
                <div className="size-10 relative rounded-full overflow-hidden shrink-0 bg-skeleton image-outline">
                  <Image
                    src="/austin.jpg"
                    alt="Austin Robinson"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-balance font-medium text-foreground">
                    Austin Robinson
                  </h1>
                  <Text>Design at Nominal</Text>
                </div>
              </div>
            </HomeEnterSection>

            <HomeEnterSection index={1}>
              <Text className="text-pretty">
                I&apos;m a software designer and engineer living in Austin, TX,
                currently building software to accelerate hardware testing at{" "}
                <AustinLink href="https://nominal.io" preview>
                  Nominal
                </AustinLink>
                .
              </Text>
            </HomeEnterSection>

            <HomeEnterSection index={2}>
              <Text className="text-pretty">
                Previously, I led design systems at{" "}
                <AustinLink href="https://tesla.com" preview>
                  Tesla
                </AustinLink>{" "}
                and{" "}
                <AustinLink href="https://hp.com" preview>
                  HP
                </AustinLink>
                , and moonlighted as a designer and engineer for{" "}
                <AustinLink href="https://papercrowns.com/" preview>
                  Paper Crowns
                </AustinLink>
                .
              </Text>
            </HomeEnterSection>
          </section>

          <div onMouseLeave={handleListSectionLeave}>
            <LayoutGroup id="home-list">
              <div className={cn("relative", listSectionClassName)}>
                <HomeEnterSection index={3}>
                  <div className="flex items-center justify-between pb-2">
                    <h2
                      id="work"
                      className="text-balance font-medium text-muted-foreground"
                    >
                      Work
                    </h2>
                    {previewPanel.panel?.type === "media" && (
                      <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground/60">
                        <Kbd><RiArrowUpSLine /></Kbd>
                        <Kbd><RiArrowDownSLine /></Kbd>
                      </span>
                    )}
                  </div>
                </HomeEnterSection>

                <HomeEnterSection index={4}>
                  <ItemGroup className="gap-0 w-full">
                    {workEntries.map((entry, index) => (
                      <WorkEntry
                        key={entry.company}
                        {...entry}
                        itemId={`work-${index}`}
                        highlightId={highlightId}
                        onHover={() =>
                          handleListItemHover(`work-${index}`, () =>
                            previewPanel.activateWork(index)
                          )
                        }
                      />
                    ))}
                    <div className="pt-14 sm:pt-16 pb-2">
                      <HomeEnterSection index={5}>
                        <h2
                          id="contact"
                          className="text-balance font-medium text-muted-foreground"
                        >
                          Contact
                        </h2>
                      </HomeEnterSection>
                    </div>
                    <ContactEntry
                      itemId="contact-twitter"
                      href="https://twitter.com/austinmrobinson"
                      title="Twitter"
                      trailing="@austinmrobinson"
                      highlightId={highlightId}
                      onHover={() =>
                        handleListItemHover("contact-twitter", () =>
                          previewPanel.activateProfile(contactProfiles.twitter)
                        )
                      }
                    />
                    <ContactEntry
                      itemId="contact-linkedin"
                      href="https://www.linkedin.com/in/robinsonaustin/"
                      title="LinkedIn"
                      trailing="robinsonaustin"
                      highlightId={highlightId}
                      onHover={() =>
                        handleListItemHover("contact-linkedin", () =>
                          previewPanel.activateProfile(contactProfiles.linkedin)
                        )
                      }
                    />
                    <CopyEmailButton
                      itemId="contact-email"
                      email="austinrobinsondesign@gmail.com"
                      highlightId={highlightId}
                      onHover={() =>
                        handleListItemHover("contact-email", () =>
                          previewPanel.activateProfile(contactProfiles.email)
                        )
                      }
                    />
                  </ItemGroup>
                </HomeEnterSection>
              </div>
            </LayoutGroup>
          </div>
        </div>

        {previewPanel.panel && (
          <div
            ref={previewPanel.carouselRef as RefObject<HTMLDivElement>}
            className="hidden lg:flex lg:w-[61.8%] flex-1 min-w-0 sticky top-6 sm:top-10 self-start items-center h-[calc(100dvh-theme(spacing.12))] sm:h-[calc(100dvh-theme(spacing.20))]"
            onMouseEnter={previewPanel.clearDeselectTimer}
            onMouseLeave={previewPanel.startDeselectTimer}
          >
            <HomeEnterSection index={7} className="flex h-full w-full items-center">
              <PreviewPanel
                panel={previewPanel.panel}
                mediaIndex={previewPanel.mediaIndex}
                onMediaIndexChange={previewPanel.setMediaIndex}
              />
            </HomeEnterSection>
          </div>
        )}
      </div>
    </PreviewPanelContext.Provider>
  );
}
