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
import { MediaCarousel } from "./components/media-carousel";
import { ProfileCardStack, type ProfileStackItem } from "./components/profile-card-stack";
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
const AUTO_ADVANCE_MS = 2500;
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
  playbackRate?: number;
}

interface WorkEntryProps {
  company: string;
  href: string;
  role: string;
  dateRange: string;
  description: string;
  media?: MediaItem[];
  disabled?: boolean;
}

interface WorkEntryComponentProps extends WorkEntryProps {
  itemId: string;
  highlightId: string | null;
  isPreviewActive?: boolean;
  hideTopDivider?: boolean;
  onHover?: () => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
}

function WorkEntry({
  company,
  role,
  dateRange,
  description,
  itemId,
  highlightId,
  isPreviewActive,
  disabled,
  hideTopDivider,
  onHover,
  onMouseLeave,
  onBlur,
}: WorkEntryComponentProps) {
  return (
    <ListItemRow
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      isPreviewActive={isPreviewActive}
      disabled={disabled}
      hideTopDivider={hideTopDivider}
      role="listitem"
      className="flex flex-col gap-3"
      onMouseEnter={disabled ? undefined : onHover}
      onMouseLeave={disabled ? undefined : onMouseLeave}
      onFocus={disabled ? undefined : onHover}
      onBlur={disabled ? undefined : onBlur}
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
  hideTopDivider?: boolean;
  onHover?: () => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
}

function ContactEntry({
  itemId,
  href,
  title,
  trailing,
  highlightId,
  isPreviewActive,
  hideTopDivider,
  onHover,
  onMouseLeave,
  onBlur,
}: ContactEntryProps) {
  return (
    <ListItemRowLink
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      isPreviewActive={isPreviewActive}
      hideTopDivider={hideTopDivider}
      href={href}
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      onFocus={onHover}
      onBlur={onBlur}
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
  hideTopDivider,
  onHover,
  onMouseLeave,
  onBlur,
}: {
  email: string;
  itemId: string;
  highlightId: string | null;
  isPreviewActive?: boolean;
  hideTopDivider?: boolean;
  onHover?: () => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
}) {
  const [, copy] = useCopyToClipboard();

  return (
    <ListItemRowButton
      id={itemId}
      highlightId={highlightId}
      highlightLayoutId={LIST_HIGHLIGHT_LAYOUT_ID}
      isPreviewActive={isPreviewActive}
      hideTopDivider={hideTopDivider}
      onClick={() => {
        copy(email)
          .then(() => toast.success("Copied Email"))
          .catch(() => toast.error("Failed to copy"));
      }}
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      onFocus={onHover}
      onBlur={onBlur}
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
      {
        src: "/projects/nominal/nominal_02.mp4",
        alt: "Nominal design work",
        type: "video",
      },
      {
        src: "/projects/nominal/nominal_01.mp4",
        alt: "Nominal product interface",
        type: "video",
      },
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
      { src: "/projects/tesla-home/tesla-home_04.png", alt: "Cross-platform Tesla digital experiences", type: "image" },
      {
        src: "/projects/cross-platform-color/cross-platform-color_05.mp4",
        alt: "Harmonious color palette generation",
        type: "video",
        playbackRate: 1.5,
      },
      { src: "/projects/tesla-home/tesla-home_01.png", alt: "Tesla Design System component library", type: "image" },
      { src: "/projects/tesla-home/tesla-home_02.png", alt: "TDS Helper design system linter", type: "image" },
      { src: "/projects/tesla-home/tesla-home_03.png", alt: "Primitive, semantic, and component color tokens", type: "image" },
      { src: "/projects/tesla-home/tesla-home_05.png", alt: "System, light, and dark theme modes", type: "image" },
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
      {
        src: "/projects/paper-crowns/paper-crowns_01.mp4",
        alt: "Call of Duty League Pick'em 2.0 showcase",
        type: "video",
      },
      {
        src: "/projects/paper-crowns/paper-crowns_02.mp4",
        alt: "Overwatch League Pick'em promo",
        type: "video",
      },
    ],
  },
  {
    company: "HP",
    href: "https://hp.com",
    role: "Designer, Design Systems",
    dateRange: "2017 — 2021",
    description:
      "Scaled the design system across organizations and platforms.",
    disabled: true,
  },
];

function shouldHideListItemTopDivider(
  itemId: string,
  highlightId: string | null,
  previousItemId: string | null
) {
  return highlightId === itemId || highlightId === previousItemId;
}

function getAdjacentWorkIndex(current: number, direction: 1 | -1) {
  if (workEntries.length === 0) return 0;

  let index = current;
  for (let step = 0; step < workEntries.length; step++) {
    index = (index + direction + workEntries.length) % workEntries.length;
    if (!workEntries[index]?.disabled) return index;
  }

  return current;
}

function findWorkIndexByHref(href: string) {
  const normalized = normalizeUrl(href);
  return workEntries.findIndex(
    (entry) => normalizeUrl(entry.href) === normalized
  );
}

function usePreviewPanel(isWorkSectionEngaged: boolean) {
  const prefersReducedMotion = useReducedMotion();
  const [panel, setPanel] = useState<PanelContent | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [pressedArrowKey, setPressedArrowKey] = useState<string | null>(null);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const deselectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const manualPauseUntil = useRef<number>(0);
  const lastWorkIndexRef = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeMedia =
    panel?.type === "media"
      ? workEntries[panel.workIndex]?.media ?? []
      : [];

  const activeSlideType = activeMedia[mediaIndex]?.type;

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
      if (workEntries[index]?.disabled) return;

      lastWorkIndexRef.current = index;
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
        if (workEntries[workIndex]?.disabled) return;

        lastWorkIndexRef.current = workIndex;
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

  const advanceToNextMedia = useCallback(() => {
    setMediaIndex((prev) => {
      const media =
        panel?.type === "media"
          ? workEntries[panel.workIndex]?.media ?? []
          : [];

      return media.length > 0 ? (prev + 1) % media.length : 0;
    });
  }, [panel]);

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
        const entry = workEntries[panel.workIndex];
        if (entry?.disabled) return false;

        return normalizeUrl(entry?.href ?? "") === normalized;
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
      activeMedia.length <= 1 ||
      activeSlideType === "video" ||
      isPreviewHovered
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
    mediaIndex,
    activeMedia.length,
    activeSlideType,
    isPreviewHovered,
    prefersReducedMotion,
    clearAutoAdvanceTimer,
  ]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const canUseWorkKeys = isWorkSectionEngaged || panel?.type === "media";
      if (!canUseWorkKeys) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        clearDeselectTimer();
        manualPauseUntil.current = 0;
        setPanel((prev) => {
          const currentIndex =
            prev?.type === "media"
              ? prev.workIndex
              : lastWorkIndexRef.current;
          const next = getAdjacentWorkIndex(currentIndex, 1);
          lastWorkIndexRef.current = next;
          setMediaIndex(0);
          return { type: "media", workIndex: next };
        });
        setPressedArrowKey(e.key);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        clearDeselectTimer();
        manualPauseUntil.current = 0;
        setPanel((prev) => {
          const currentIndex =
            prev?.type === "media"
              ? prev.workIndex
              : lastWorkIndexRef.current;
          const next = getAdjacentWorkIndex(currentIndex, -1);
          lastWorkIndexRef.current = next;
          setMediaIndex(0);
          return { type: "media", workIndex: next };
        });
        setPressedArrowKey(e.key);
      } else if (panel?.type === "media") {
        if (e.key === "ArrowRight" && activeMedia.length > 1) {
          e.preventDefault();
          pauseAutoAdvance();
          setMediaIndex((prev) =>
            activeMedia.length > 0 ? (prev + 1) % activeMedia.length : 0
          );
          setPressedArrowKey(e.key);
        } else if (e.key === "ArrowLeft" && activeMedia.length > 1) {
          e.preventDefault();
          pauseAutoAdvance();
          setMediaIndex((prev) =>
            activeMedia.length > 0
              ? (prev - 1 + activeMedia.length) % activeMedia.length
              : 0
          );
          setPressedArrowKey(e.key);
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        setPressedArrowKey((current) => (current === e.key ? null : current));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    panel,
    activeMedia.length,
    clearDeselectTimer,
    pauseAutoAdvance,
    isWorkSectionEngaged,
  ]);

  return useMemo(
    () => ({
      panel,
      mediaIndex,
      pressedArrowKey,
      carouselRef,
      isPreviewHovered,
      activateWork,
      activateHref,
      activateProfile,
      setMediaIndex: handleMediaIndexChange,
      advanceToNextMedia,
      setIsPreviewHovered,
      clearDeselectTimer,
      startDeselectTimer,
      isWorkActive,
      isHrefActive,
      isProfileActive,
    }),
    [
      panel,
      mediaIndex,
      pressedArrowKey,
      isPreviewHovered,
      activateWork,
      activateHref,
      activateProfile,
      handleMediaIndexChange,
      advanceToNextMedia,
      clearDeselectTimer,
      startDeselectTimer,
      isWorkActive,
      isHrefActive,
      isProfileActive,
    ]
  );
}

function PreviewPanel({
  panel,
  mediaIndex,
  onMediaIndexChange,
  onActiveVideoEnded,
  isPreviewHovered,
  onSelectProfile,
  onCopyEmail,
  pressedArrowKey,
}: {
  panel: PanelContent;
  mediaIndex: number;
  onMediaIndexChange: (index: number) => void;
  onActiveVideoEnded?: () => void;
  isPreviewHovered?: boolean;
  onSelectProfile: (profile: ProfileStackItem) => void;
  onCopyEmail: (email: string) => void;
  pressedArrowKey?: string | null;
}) {
  if (panel.type === "media") {
    return (
      <div className="w-full min-w-0">
        <MediaCarousel
          media={workEntries[panel.workIndex]?.media ?? []}
          activeIndex={mediaIndex}
          onIndexChange={onMediaIndexChange}
          onActiveVideoEnded={onActiveVideoEnded}
          isPaused={isPreviewHovered}
          companyName={workEntries[panel.workIndex]?.company}
          pressedArrowKey={pressedArrowKey}
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
  onActiveVideoEnded,
  isPreviewHovered,
  onPreviewHoverChange,
  panelRef,
  startDeselectTimer,
  onPreviewEnter,
  onContentExitComplete,
  onSelectProfile,
  onCopyEmail,
  pressedArrowKey,
}: {
  panel: PanelContent;
  isOpen: boolean;
  mediaIndex: number;
  onMediaIndexChange: (index: number) => void;
  onActiveVideoEnded?: () => void;
  isPreviewHovered?: boolean;
  onPreviewHoverChange?: (hovered: boolean) => void;
  panelRef: RefObject<HTMLDivElement | null>;
  startDeselectTimer: () => void;
  onPreviewEnter: () => void;
  onContentExitComplete: () => void;
  onSelectProfile: (profile: ProfileStackItem) => void;
  onCopyEmail: (email: string) => void;
  pressedArrowKey?: string | null;
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
    <div className="hidden lg:block flex-1 min-w-0 self-start">
      <div className="sticky top-0 flex h-dvh w-full items-center">
        <div
          ref={panelRef as RefObject<HTMLDivElement>}
          className="w-full min-w-0"
          onMouseEnter={() => {
            onPreviewEnter();
            onPreviewHoverChange?.(true);
          }}
          onMouseLeave={() => {
            onPreviewHoverChange?.(false);
            startDeselectTimer();
          }}
        >
          <AnimatePresence
            initial={false}
            mode="popLayout"
            onExitComplete={onContentExitComplete}
          >
            {isOpen && (
              <motion.div
                key={getPanelKey(panel)}
                layout={false}
                {...contentMotion}
                transition={previewBlurTransition}
                className="w-full min-w-0"
              >
                <PreviewPanel
                  panel={panel}
                  mediaIndex={mediaIndex}
                  onMediaIndexChange={onMediaIndexChange}
                  onActiveVideoEnded={onActiveVideoEnded}
                  isPreviewHovered={isPreviewHovered}
                  onSelectProfile={onSelectProfile}
                  onCopyEmail={onCopyEmail}
                  pressedArrowKey={pressedArrowKey}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const workSectionRef = useRef<HTMLDivElement>(null);
  const listSectionRef = useRef<HTMLDivElement>(null);
  const [isWorkSectionEngaged, setIsWorkSectionEngaged] = useState(false);
  const [suppressListHighlight, setSuppressListHighlight] = useState(false);
  const previewPanel = usePreviewPanel(isWorkSectionEngaged);
  const [, copyEmail] = useCopyToClipboard();
  const [hoveredListItemId, setHoveredListItemId] = useState<string | null>(null);
  const [highlightVisible, setHighlightVisible] = useState(true);
  const [slotPanel, setSlotPanel] = useState<PanelContent | null>(null);
  const highlightExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePanelRef = useRef<PanelContent | null>(null);

  const activeHighlightId = suppressListHighlight
    ? hoveredListItemId
    : hoveredListItemId ?? getListHighlightId(previewPanel.panel);
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

  function isMovingToPreview(relatedTarget: EventTarget | null) {
    return (
      relatedTarget instanceof Node &&
      previewPanel.carouselRef.current?.contains(relatedTarget)
    );
  }

  function dismissListInteraction() {
    previewPanel.startDeselectTimer();
    clearHighlightExitTimer();
    highlightExitTimer.current = setTimeout(() => {
      setHighlightVisible(false);
    }, HIGHLIGHT_EXIT_DELAY_MS);
  }

  function handleListItemHover(id: string, activate: () => void) {
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      active.id !== id &&
      listSectionRef.current?.contains(active)
    ) {
      active.blur();
    }

    clearHighlightExitTimer();
    setSuppressListHighlight(false);
    setHighlightVisible(true);
    setHoveredListItemId(id);
    activate();
  }

  function handleListItemMouseLeave(event: React.MouseEvent<HTMLElement>) {
    const relatedTarget = event.relatedTarget;

    if (
      relatedTarget instanceof Node &&
      (listSectionRef.current?.contains(relatedTarget) ||
        isMovingToPreview(relatedTarget))
    ) {
      return;
    }

    setHoveredListItemId(null);

    if (event.currentTarget === document.activeElement) {
      event.currentTarget.blur();
    }

    dismissListInteraction();
  }

  function handleListGapEnter() {
    setHoveredListItemId(null);
    setSuppressListHighlight(true);
  }

  function handleWorkSectionFocusIn() {
    setIsWorkSectionEngaged(true);
  }

  function handleWorkSectionFocusOut(event: React.FocusEvent<HTMLDivElement>) {
    if (!workSectionRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsWorkSectionEngaged(false);
    }
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
    setSuppressListHighlight(false);
  }

  function blurActiveListItem() {
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      listSectionRef.current?.contains(active)
    ) {
      active.blur();
    }
  }

  function handleListItemBlur(event: React.FocusEvent<HTMLElement>) {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget instanceof Node &&
      listSectionRef.current?.contains(relatedTarget)
    ) {
      return;
    }

    setHoveredListItemId(null);
  }

  function handlePreviewEnter() {
    previewPanel.clearDeselectTimer();
    clearHighlightExitTimer();
    setHighlightVisible(true);
    blurActiveListItem();
  }

  function handleListSectionLeave(event: React.MouseEvent<HTMLDivElement>) {
    setHoveredListItemId(null);
    blurActiveListItem();

    if (isMovingToPreview(event.relatedTarget)) {
      clearHighlightExitTimer();
      return;
    }

    dismissListInteraction();
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
    if (previewPanel.panel) {
      setHighlightVisible(true);
      clearHighlightExitTimer();
      return;
    }

    clearHighlightExitTimer();
    highlightExitTimer.current = setTimeout(() => {
      setHighlightVisible(false);
    }, HIGHLIGHT_EXIT_DELAY_MS);
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
            ref={listSectionRef}
            onMouseEnter={handleListSectionEnter}
            onMouseLeave={handleListSectionLeave}
          >
            <LayoutGroup id="home-list">
              <div className={cn("relative", listSectionClassName)}>
                <div
                  ref={workSectionRef}
                  onMouseEnter={() => setIsWorkSectionEngaged(true)}
                  onMouseLeave={() => setIsWorkSectionEngaged(false)}
                  onFocusCapture={handleWorkSectionFocusIn}
                  onBlurCapture={handleWorkSectionFocusOut}
                >
                  <HomeEnterSection index={3}>
                    <div className="pb-2">
                      <h2
                        id="work"
                        className="text-balance font-medium text-muted-foreground"
                      >
                        Work
                      </h2>
                    </div>
                  </HomeEnterSection>

                  <HomeEnterSection index={4}>
                    <ItemGroup className="gap-0 w-full">
                      {workEntries.map((entry, index) => {
                        const itemId = `work-${index}`;
                        const previousItemId =
                          index > 0 ? `work-${index - 1}` : null;

                        return (
                          <WorkEntry
                            key={entry.company}
                            {...entry}
                            itemId={itemId}
                            highlightId={highlightId}
                            isPreviewActive={
                              !!previewPanel.panel && highlightId === itemId
                            }
                            hideTopDivider={shouldHideListItemTopDivider(
                              itemId,
                              highlightId,
                              previousItemId
                            )}
                            onHover={
                              entry.disabled
                                ? undefined
                                : () =>
                                    handleListItemHover(itemId, () =>
                                      previewPanel.activateWork(index)
                                    )
                            }
                            onBlur={handleListItemBlur}
                            onMouseLeave={handleListItemMouseLeave}
                          />
                        );
                      })}
                    </ItemGroup>
                  </HomeEnterSection>
                </div>

                <div
                  className="pt-14 sm:pt-16 pb-2"
                  onMouseEnter={handleListGapEnter}
                >
                  <HomeEnterSection index={5}>
                    <h2
                      id="contact"
                      className="text-balance font-medium text-muted-foreground"
                    >
                      Contact
                    </h2>
                  </HomeEnterSection>
                </div>

                <HomeEnterSection index={6}>
                  <ItemGroup className="gap-0 w-full">
                    <ContactEntry
                      itemId="contact-twitter"
                      href="https://twitter.com/austinmrobinson"
                      title="Twitter"
                      trailing="@austinmrobinson"
                      highlightId={highlightId}
                      isPreviewActive={
                        !!previewPanel.panel && highlightId === "contact-twitter"
                      }
                      hideTopDivider={shouldHideListItemTopDivider(
                        "contact-twitter",
                        highlightId,
                        `work-${workEntries.length - 1}`
                      )}
                      onHover={() =>
                        handleListItemHover("contact-twitter", () =>
                          previewPanel.activateProfile(contactProfiles.twitter)
                        )
                      }
                      onBlur={handleListItemBlur}
                      onMouseLeave={handleListItemMouseLeave}
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
                      hideTopDivider={shouldHideListItemTopDivider(
                        "contact-linkedin",
                        highlightId,
                        "contact-twitter"
                      )}
                      onHover={() =>
                        handleListItemHover("contact-linkedin", () =>
                          previewPanel.activateProfile(contactProfiles.linkedin)
                        )
                      }
                      onBlur={handleListItemBlur}
                      onMouseLeave={handleListItemMouseLeave}
                    />
                    <CopyEmailButton
                      itemId="contact-email"
                      email="austinrobinsondesign@gmail.com"
                      highlightId={highlightId}
                      isPreviewActive={
                        !!previewPanel.panel && highlightId === "contact-email"
                      }
                      hideTopDivider={shouldHideListItemTopDivider(
                        "contact-email",
                        highlightId,
                        "contact-linkedin"
                      )}
                      onHover={() =>
                        handleListItemHover("contact-email", () =>
                          previewPanel.activateProfile(contactProfiles.email)
                        )
                      }
                      onBlur={handleListItemBlur}
                      onMouseLeave={handleListItemMouseLeave}
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
            onActiveVideoEnded={previewPanel.advanceToNextMedia}
            isPreviewHovered={previewPanel.isPreviewHovered}
            onPreviewHoverChange={previewPanel.setIsPreviewHovered}
            panelRef={previewPanel.carouselRef}
            startDeselectTimer={previewPanel.startDeselectTimer}
            onPreviewEnter={handlePreviewEnter}
            onSelectProfile={handlePreviewCardSelect}
            onCopyEmail={handlePreviewCopyEmail}
            pressedArrowKey={previewPanel.pressedArrowKey}
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
