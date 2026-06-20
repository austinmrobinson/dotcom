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
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
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
import { ProfileCardStack, type ProfileStackItem } from "./components/profile-card-stack";
import { RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react";
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
const HIGHLIGHT_EXIT_DELAY_MS = 150;
const AUTO_ADVANCE_MS = 4000;
const MANUAL_PAUSE_MS = 8000;

const blurEase = [0.25, 0.46, 0.45, 0.94] as const;
const previewBlurTransition = { duration: 0.4, ease: blurEase };
const previewBlur = "12px";

function getPanelKey(panel: PanelContent) {
  if (panel.type === "media") return `media-${panel.workIndex}`;
  if (panel.type === "profile") return "profile-stack";
  return panel.type;
}

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
  },
} satisfies Record<string, Omit<ProfilePanelContent, "type">>;

const contactProfileList = [
  contactProfiles.twitter,
  contactProfiles.linkedin,
  contactProfiles.email,
];

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
  isPreviewActive?: boolean;
  onHover?: () => void;
}

function WorkEntry({
  company,
  role,
  dateRange,
  description,
  itemId,
  highlightId,
  isPreviewActive,
  onHover,
}: WorkEntryComponentProps) {
  return (
    <ListItemRow
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      isPreviewActive={isPreviewActive}
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
  isPreviewActive?: boolean;
  onHover?: () => void;
}

function ContactEntry({
  itemId,
  href,
  title,
  trailing,
  highlightId,
  isPreviewActive,
  onHover,
}: ContactEntryProps) {
  return (
    <ListItemRowLink
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      isPreviewActive={isPreviewActive}
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
  isPreviewActive,
  onHover,
}: {
  email: string;
  itemId: string;
  highlightId: string | null;
  isPreviewActive?: boolean;
  onHover?: () => void;
}) {
  const [, copy] = useCopyToClipboard();

  return (
    <ListItemRowButton
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      isPreviewActive={isPreviewActive}
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
  onSelectProfile,
  onCopyEmail,
}: {
  panel: PanelContent;
  mediaIndex: number;
  onMediaIndexChange: (index: number) => void;
  onSelectProfile: (profile: ProfileStackItem) => void;
  onCopyEmail: (email: string) => void;
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
    return (
      <ProfileCardStack
        profiles={contactProfileList}
        activeId={panel.id}
        onSelectProfile={onSelectProfile}
        onCopyEmail={onCopyEmail}
      />
    );
  }

  return null;
}

function PreviewPanelSlot({
  panel,
  isOpen,
  mediaIndex,
  onMediaIndexChange,
  panelRef,
  clearDeselectTimer,
  startDeselectTimer,
  onContentExitComplete,
  onSelectProfile,
  onCopyEmail,
}: {
  panel: PanelContent;
  isOpen: boolean;
  mediaIndex: number;
  onMediaIndexChange: (index: number) => void;
  panelRef: RefObject<HTMLDivElement | null>;
  clearDeselectTimer: () => void;
  startDeselectTimer: () => void;
  onContentExitComplete: () => void;
  onSelectProfile: (profile: ProfileStackItem) => void;
  onCopyEmail: (email: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  const contentMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, filter: `blur(${previewBlur})` },
        animate: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: `blur(${previewBlur})` },
      };

  return (
    <div
      ref={panelRef}
      className="hidden lg:flex flex-1 min-w-0 sticky top-6 sm:top-10 self-start items-center h-[calc(100dvh-theme(spacing.12))] sm:h-[calc(100dvh-theme(spacing.20))]"
    >
      <div
        className="relative w-full min-w-0 aspect-video"
        onMouseEnter={clearDeselectTimer}
        onMouseLeave={startDeselectTimer}
      >
        <AnimatePresence initial={false} onExitComplete={onContentExitComplete}>
          {isOpen && (
            <motion.div
              key={getPanelKey(panel)}
              {...contentMotion}
              transition={previewBlurTransition}
              className="absolute inset-0 w-full min-w-0"
            >
              <PreviewPanel
                panel={panel}
                mediaIndex={mediaIndex}
                onMediaIndexChange={onMediaIndexChange}
                onSelectProfile={onSelectProfile}
                onCopyEmail={onCopyEmail}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  const previewPanel = usePreviewPanel();
  const [, copyEmail] = useCopyToClipboard();
  const [hoveredListItemId, setHoveredListItemId] = useState<string | null>(null);
  const [highlightVisible, setHighlightVisible] = useState(true);
  const [slotPanel, setSlotPanel] = useState<PanelContent | null>(null);
  const highlightExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePanelRef = useRef<PanelContent | null>(null);

  const activeHighlightId =
    hoveredListItemId ?? getListHighlightId(previewPanel.panel);
  const highlightId = highlightVisible ? activeHighlightId : null;
  const displayedPanel = previewPanel.panel ?? slotPanel;

  useEffect(() => {
    activePanelRef.current = previewPanel.panel;
  }, [previewPanel.panel]);

  function clearHighlightExitTimer() {
    if (highlightExitTimer.current) {
      clearTimeout(highlightExitTimer.current);
      highlightExitTimer.current = null;
    }
  }

  function handleListItemHover(id: string, activate: () => void) {
    clearHighlightExitTimer();
    setHighlightVisible(true);
    setHoveredListItemId(id);
    activate();
  }

  function handlePreviewCardSelect(profile: ProfileStackItem) {
    clearHighlightExitTimer();
    setHighlightVisible(true);
    setHoveredListItemId(`contact-${profile.id}`);
    previewPanel.clearDeselectTimer();
    previewPanel.activateProfile(
      contactProfiles[profile.id as keyof typeof contactProfiles]
    );
  }

  function handlePreviewCopyEmail(email: string) {
    copyEmail(email)
      .then(() => toast.success("Copied Email"))
      .catch(() => toast.error("Failed to copy"));
  }

  function handleListSectionEnter() {
    clearHighlightExitTimer();
    setHighlightVisible(true);
  }

  function handleListSectionLeave() {
    setHoveredListItemId(null);
    previewPanel.startDeselectTimer();
    clearHighlightExitTimer();
    highlightExitTimer.current = setTimeout(() => {
      setHighlightVisible(false);
    }, HIGHLIGHT_EXIT_DELAY_MS);
  }

  useEffect(() => {
    return () => clearHighlightExitTimer();
  }, []);

  useEffect(() => {
    if (previewPanel.panel) {
      setSlotPanel(previewPanel.panel);
    }
  }, [previewPanel.panel]);

  useEffect(() => {
    if (!previewPanel.panel) {
      setHighlightVisible(true);
      clearHighlightExitTimer();
    }
  }, [previewPanel.panel]);

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
        <div className="relative flex flex-col gap-14 sm:gap-16 w-full lg:w-[480px] lg:shrink-0">
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

          <div
            onMouseEnter={handleListSectionEnter}
            onMouseLeave={handleListSectionLeave}
          >
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
                    {workEntries.map((entry, index) => {
                      const itemId = `work-${index}`;

                      return (
                        <WorkEntry
                          key={entry.company}
                          {...entry}
                          itemId={itemId}
                          highlightId={highlightId}
                          isPreviewActive={
                            !!previewPanel.panel && highlightId === itemId
                          }
                          onHover={() =>
                            handleListItemHover(itemId, () =>
                              previewPanel.activateWork(index)
                            )
                          }
                        />
                      );
                    })}
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
                      isPreviewActive={
                        !!previewPanel.panel && highlightId === "contact-twitter"
                      }
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
                      isPreviewActive={
                        !!previewPanel.panel && highlightId === "contact-linkedin"
                      }
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
                      isPreviewActive={
                        !!previewPanel.panel && highlightId === "contact-email"
                      }
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

        {displayedPanel && (
          <PreviewPanelSlot
            panel={displayedPanel}
            isOpen={!!previewPanel.panel}
            mediaIndex={previewPanel.mediaIndex}
            onMediaIndexChange={previewPanel.setMediaIndex}
            panelRef={previewPanel.carouselRef}
            clearDeselectTimer={previewPanel.clearDeselectTimer}
            startDeselectTimer={previewPanel.startDeselectTimer}
            onSelectProfile={handlePreviewCardSelect}
            onCopyEmail={handlePreviewCopyEmail}
            onContentExitComplete={() => {
              if (!activePanelRef.current) {
                setSlotPanel(null);
              }
            }}
          />
        )}
      </div>
    </PreviewPanelContext.Provider>
  );
}
