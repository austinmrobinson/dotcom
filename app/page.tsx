"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text } from "./components/text";
import AustinLink from "./components/link";
import { prefetchOgMetadata } from "./hooks/use-og-metadata";
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
import { RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react";
import { MouseSafeArea } from "./components/mouse-safe-area";

const ENABLE_WORK_CAROUSEL = false;

const PREFETCH_URLS = [
  "https://nominal.io",
  "https://tesla.com",
  "https://papercrowns.com",
  "https://hp.com",
];

const outdentedItem =
  "relative -mx-4 px-4 py-4 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 before:absolute before:top-0 before:inset-x-4 before:h-px before:bg-border-light before:transition-opacity";

function CopyEmailButton({ email }: { email: string }) {
  const [, copy] = useCopyToClipboard();

  return (
    <button
      onClick={() => {
        copy(email)
          .then(() => toast.success("Copied Email"))
          .catch(() => toast.error("Failed to copy"));
      }}
      className={`cursor-pointer text-left hover:bg-overlay-light hover:before:opacity-0 [&:hover+*]:before:opacity-0 ${outdentedItem}`}
    >
      <Item className="px-0 py-0">
        <ItemContent>
          <ItemTitle>Email</ItemTitle>
        </ItemContent>
        <ItemActions>
          <span className="text-muted-foreground">{email}</span>
        </ItemActions>
      </Item>
    </button>
  );
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
  isActive?: boolean;
  onHover?: () => void;
}

function WorkEntry({
  company,
  href,
  role,
  dateRange,
  description,
  isActive,
  onHover,
}: WorkEntryComponentProps) {
  const interactive = ENABLE_WORK_CAROUSEL;
  const Tag = interactive ? "div" : "a";
  const linkProps = interactive ? {} : { href, target: "_blank" as const };

  return (
    <Tag
      role="listitem"
      onMouseEnter={interactive ? onHover : undefined}
      className={`group/entry relative flex flex-col gap-3 ${outdentedItem} ${
        interactive && isActive
          ? "bg-overlay-light before:opacity-0 [&+*]:before:opacity-0"
          : "hover:bg-overlay-light hover:before:opacity-0 [&:hover+*]:before:opacity-0"
      }`}
      {...linkProps}
    >
      <Item className="px-0 py-0 items-start">
        <ItemContent>
          <ItemTitle>{company}</ItemTitle>
          <ItemDescription>{role}</ItemDescription>
        </ItemContent>
        <ItemActions className="mt-0.5">
          <span className="text-muted-foreground whitespace-nowrap">
            {dateRange}
          </span>
        </ItemActions>
      </Item>
      <Text className="text-pretty">{description}</Text>
    </Tag>
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
      { src: "/placeholder-image.jpg", alt: "Nominal – placeholder", type: "image" },
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
      { src: "/placeholder-image.jpg", alt: "Paper Crowns – placeholder", type: "image" },
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
      { src: "/placeholder-image.jpg", alt: "HP – placeholder", type: "image" },
    ],
  },
];

const DESELECT_DELAY = 400;

function useWorkCarousel() {
  const [activeCompanyIndex, setActiveCompanyIndex] = useState<number | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const deselectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeMedia =
    activeCompanyIndex !== null
      ? workEntries[activeCompanyIndex]?.media ?? []
      : [];

  const clearDeselectTimer = useCallback(() => {
    if (deselectTimer.current) {
      clearTimeout(deselectTimer.current);
      deselectTimer.current = null;
    }
  }, []);

  const startDeselectTimer = useCallback(() => {
    clearDeselectTimer();
    deselectTimer.current = setTimeout(() => {
      setActiveCompanyIndex(null);
      setActiveMediaIndex(0);
    }, DESELECT_DELAY);
  }, [clearDeselectTimer]);

  const handleCompanyHover = useCallback(
    (index: number) => {
      clearDeselectTimer();
      setActiveCompanyIndex(index);
      setActiveMediaIndex(0);
    },
    [clearDeselectTimer]
  );

  const handleWorkSectionLeave = useCallback(() => {
    startDeselectTimer();
  }, [startDeselectTimer]);

  useEffect(() => {
    return () => clearDeselectTimer();
  }, [clearDeselectTimer]);

  useEffect(() => {
    if (!ENABLE_WORK_CAROUSEL) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        clearDeselectTimer();
        setActiveCompanyIndex((prev) => {
          const next = prev === null ? 0 : (prev + 1) % workEntries.length;
          setActiveMediaIndex(0);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        clearDeselectTimer();
        setActiveCompanyIndex((prev) => {
          const next =
            prev === null
              ? workEntries.length - 1
              : (prev - 1 + workEntries.length) % workEntries.length;
          setActiveMediaIndex(0);
          return next;
        });
      } else if (e.key === "ArrowRight" && activeCompanyIndex !== null) {
        e.preventDefault();
        setActiveMediaIndex((prev) =>
          activeMedia.length > 0 ? (prev + 1) % activeMedia.length : 0
        );
      } else if (e.key === "ArrowLeft" && activeCompanyIndex !== null) {
        e.preventDefault();
        setActiveMediaIndex((prev) =>
          activeMedia.length > 0
            ? (prev - 1 + activeMedia.length) % activeMedia.length
            : 0
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMedia.length, activeCompanyIndex, clearDeselectTimer]);

  return {
    activeCompanyIndex,
    activeMediaIndex,
    setActiveMediaIndex,
    activeMedia,
    carouselRef,
    clearDeselectTimer,
    startDeselectTimer,
    handleCompanyHover,
    handleWorkSectionLeave,
  };
}

export default function Home() {
  const carousel = useWorkCarousel();

  return (
    <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">
      <div className="flex flex-col gap-14 sm:gap-16 w-full lg:w-[38.2%] lg:min-w-80 lg:max-w-md shrink-0 lg:shrink">
        <section
          id="introduction"
          className="flex flex-col gap-4 justify-start"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 relative rounded-full overflow-hidden shrink-0 bg-skeleton">
              <Image
                src="/austin.jpg"
                alt="Austin Robinson"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="font-medium text-foreground">Austin Robinson</h1>
              <Text>Design at Nominal</Text>
            </div>
          </div>
          <Text className="text-pretty">
            I&apos;m a software designer and engineer living in Austin, TX,
            currently building software to accelerate hardware testing at{" "}
            <AustinLink href="https://nominal.io" preview>
              Nominal
            </AustinLink>
            .
          </Text>
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
        </section>

        <section id="work" className="flex flex-col">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-medium text-muted-foreground">Work</h2>
            {ENABLE_WORK_CAROUSEL && carousel.activeCompanyIndex !== null && (
              <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground/60">
                <Kbd><RiArrowUpSLine /></Kbd>
                <Kbd><RiArrowDownSLine /></Kbd>
              </span>
            )}
          </div>
          <div className="relative">
            <ItemGroup
              className="gap-0"
              onMouseLeave={ENABLE_WORK_CAROUSEL ? carousel.handleWorkSectionLeave : undefined}
            >
              {workEntries.map((entry, index) => (
                <WorkEntry
                  key={entry.company}
                  {...entry}
                  isActive={ENABLE_WORK_CAROUSEL ? carousel.activeCompanyIndex === index : undefined}
                  onHover={ENABLE_WORK_CAROUSEL ? () => carousel.handleCompanyHover(index) : undefined}
                />
              ))}
              {ENABLE_WORK_CAROUSEL && carousel.activeCompanyIndex !== null && (
                <MouseSafeArea parentRef={carousel.carouselRef} />
              )}
            </ItemGroup>
          </div>
        </section>

        <section id="contact" className="flex flex-col">
          <h2 className="font-medium text-muted-foreground pb-2">Contact</h2>
          <ItemGroup className="gap-0">
            <a
              href="https://twitter.com/austinmrobinson"
              target="_blank"
              className={`hover:bg-overlay-light hover:before:opacity-0 [&:hover+*]:before:opacity-0 ${outdentedItem}`}
            >
              <Item className="px-0 py-0">
                <ItemContent>
                  <ItemTitle>Twitter</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <span className="text-muted-foreground">
                    @austinmrobinson
                  </span>
                </ItemActions>
              </Item>
            </a>
            <a
              href="https://www.linkedin.com/in/robinsonaustin/"
              target="_blank"
              className={`hover:bg-overlay-light hover:before:opacity-0 [&:hover+*]:before:opacity-0 ${outdentedItem}`}
            >
              <Item className="px-0 py-0">
                <ItemContent>
                  <ItemTitle>LinkedIn</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <span className="text-muted-foreground">robinsonaustin</span>
                </ItemActions>
              </Item>
            </a>
            <CopyEmailButton email="austinrobinsondesign@gmail.com" />
          </ItemGroup>
        </section>
      </div>

      {ENABLE_WORK_CAROUSEL && carousel.activeCompanyIndex !== null && (
        <div
          ref={carousel.carouselRef}
          className="hidden lg:block lg:w-[61.8%] flex-1 min-w-0"
          onMouseEnter={carousel.clearDeselectTimer}
          onMouseLeave={carousel.startDeselectTimer}
        >
          <div className="sticky top-6 sm:top-10 h-[calc(100dvh-theme(spacing.12))] sm:h-[calc(100dvh-theme(spacing.20))]">
            <MediaCarousel
              media={carousel.activeMedia}
              activeIndex={carousel.activeMediaIndex}
              onIndexChange={carousel.setActiveMediaIndex}
              companyName={workEntries[carousel.activeCompanyIndex]?.company}
            />
          </div>
        </div>
      )}
    </div>
  );
}
