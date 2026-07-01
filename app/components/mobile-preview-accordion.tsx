"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/app/components/ui/item";
import { Button } from "@/app/components/ui/button";
import { MediaCarousel } from "@/app/components/media-carousel";
import { ProfileCard } from "@/app/components/profile-card";
import { Text } from "@/app/components/text";
import { cn } from "@/app/lib/utils";
import type { ProfileStackItem } from "@/app/components/profile-card-stack";
import {
  PREVIEW_MEDIA_LAYOUT_ID,
  getPreviewProfileLayoutId,
} from "@/app/components/preview-lightbox";

interface MediaItem {
  src: string;
  alt: string;
  type: "image" | "video";
  playbackRate?: number;
}

interface WorkEntryData {
  company: string;
  role: string;
  dateRange: string;
  description: string;
  media?: MediaItem[];
  disabled?: boolean;
}

interface MobilePreviewAccordionProps {
  workEntries: WorkEntryData[];
  contactProfiles: {
    twitter: ProfileStackItem & { href: string };
    linkedin: ProfileStackItem & { href: string };
    email: ProfileStackItem;
  };
  onMediaExpand?: (workIndex: number, mediaIndex: number) => void;
  onProfileExpand?: (id: string) => void;
  lightbox?: { type: "media"; workIndex: number } | { type: "profile"; id: string } | null;
}

function MobileWorkAccordionItem({
  entry,
  index,
  onMediaExpand,
  lightbox,
}: {
  entry: WorkEntryData;
  index: number;
  onMediaExpand?: (workIndex: number, mediaIndex: number) => void;
  lightbox?: MobilePreviewAccordionProps["lightbox"];
}) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const value = `work-${index}`;
  const isLightboxOpen =
    lightbox?.type === "media" && lightbox.workIndex === index;

  return (
    <AccordionItem value={value} className="border-border-light">
      <AccordionTrigger
        className={cn(
          "w-[calc(100%+2rem)] -mx-4 px-4 py-4 rounded-lg hover:no-underline",
          "[&_[data-slot=accordion-trigger-icon]]:hidden"
        )}
      >
        <div className="flex w-full min-w-0 flex-col gap-3 pr-2 text-left">
          <Item className="w-full min-w-0 flex-nowrap items-start justify-between px-0 py-0">
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full">{entry.company}</ItemTitle>
              <ItemDescription>{entry.role}</ItemDescription>
            </ItemContent>
            <ItemActions className="mt-0.5">
              <span className="whitespace-nowrap tabular-nums text-muted-foreground">
                {entry.dateRange}
              </span>
            </ItemActions>
          </Item>
          <Text className="text-pretty">{entry.description}</Text>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-6">
        {entry.media && entry.media.length > 0 ? (
          <MediaCarousel
            media={entry.media}
            activeIndex={mediaIndex}
            onIndexChange={setMediaIndex}
            layoutId={PREVIEW_MEDIA_LAYOUT_ID}
            onViewportClick={
              onMediaExpand
                ? () => onMediaExpand(index, mediaIndex)
                : undefined
            }
            isLightboxOpen={isLightboxOpen}
          />
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileContactAccordionItem({
  id,
  title,
  trailing,
  profile,
  href,
  onProfileExpand,
  onCopyEmail,
  lightbox,
}: {
  id: string;
  title: string;
  trailing: string;
  profile: ProfileStackItem;
  href?: string;
  onProfileExpand?: (id: string) => void;
  onCopyEmail?: (email: string) => void;
  lightbox?: MobilePreviewAccordionProps["lightbox"];
}) {
  const prefersReducedMotion = useReducedMotion();
  const isLightboxOpen = lightbox?.type === "profile" && lightbox.id === id;
  const layoutId =
    !prefersReducedMotion && !isLightboxOpen
      ? getPreviewProfileLayoutId(id)
      : undefined;

  const profilePreview = <ProfileCard {...profile} />;

  return (
    <AccordionItem value={`contact-${id}`} className="border-border-light">
      <AccordionTrigger
        className={cn(
          "w-[calc(100%+2rem)] -mx-4 px-4 py-4 rounded-lg hover:no-underline",
          "[&_[data-slot=accordion-trigger-icon]]:hidden"
        )}
      >
        <Item className="w-full min-w-0 flex-nowrap items-center justify-between px-0 py-0">
          <ItemContent className="min-w-0">
            <ItemTitle className="w-full">{title}</ItemTitle>
          </ItemContent>
          <span className="shrink-0 whitespace-nowrap text-muted-foreground">
            {trailing}
          </span>
        </Item>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 px-4 pb-6">
        {layoutId ? (
          <motion.button
            type="button"
            layoutId={layoutId}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => onProfileExpand?.(id)}
            aria-label={`Expand ${title} preview`}
            className="w-full cursor-zoom-in text-left"
          >
            {profilePreview}
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={() => onProfileExpand?.(id)}
            aria-label={`Expand ${title} preview`}
            className={cn(
              "w-full cursor-zoom-in text-left",
              isLightboxOpen && "pointer-events-none"
            )}
          >
            {profilePreview}
          </button>
        )}
        {profile.platform === "email" ? (
          <Button
            variant="outline"
            onClick={() => onCopyEmail?.(profile.handle)}
          >
            Copy email
          </Button>
        ) : href ? (
          <Button variant="outline" render={<a href={href} target="_blank" />}>
            Open {title}
          </Button>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}

export function MobilePreviewAccordion({
  workEntries,
  contactProfiles,
  onMediaExpand,
  onProfileExpand,
  lightbox,
}: MobilePreviewAccordionProps) {
  const [, copy] = useCopyToClipboard();
  const [openItems, setOpenItems] = useState<string[]>([]);

  function handleCopyEmail(email: string) {
    copy(email)
      .then(() => toast.success("Copied Email"))
      .catch(() => toast.error("Failed to copy"));
  }

  return (
    <Accordion
      className="lg:hidden w-full gap-0"
      value={openItems}
      onValueChange={setOpenItems}
    >
      {workEntries.map((entry, index) => {
        if (entry.disabled) {
          return (
            <div
              key={entry.company}
              className="flex flex-col gap-3 border-b border-border-light px-4 py-4 opacity-50"
            >
              <Item className="w-full min-w-0 flex-nowrap items-start justify-between px-0 py-0">
                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full">{entry.company}</ItemTitle>
                  <ItemDescription>{entry.role}</ItemDescription>
                </ItemContent>
                <ItemActions className="mt-0.5">
                  <span className="whitespace-nowrap tabular-nums text-muted-foreground">
                    {entry.dateRange}
                  </span>
                </ItemActions>
              </Item>
              <Text className="text-pretty">{entry.description}</Text>
            </div>
          );
        }

        return (
          <MobileWorkAccordionItem
            key={entry.company}
            entry={entry}
            index={index}
            onMediaExpand={onMediaExpand}
            lightbox={lightbox}
          />
        );
      })}

      <div className="pt-14 sm:pt-16 pb-2">
        <h2
          id="contact-mobile"
          className="text-balance font-medium text-muted-foreground"
        >
          Contact
        </h2>
      </div>

      {(
        [
          {
            id: "twitter",
            title: "Twitter",
            trailing: "@austinmrobinson",
            profile: contactProfiles.twitter,
            href: contactProfiles.twitter.href,
          },
          {
            id: "linkedin",
            title: "LinkedIn",
            trailing: "robinsonaustin",
            profile: contactProfiles.linkedin,
            href: contactProfiles.linkedin.href,
          },
          {
            id: "email",
            title: "Email",
            trailing: contactProfiles.email.handle,
            profile: contactProfiles.email,
          },
        ] as const
      ).map((contact) => (
        <MobileContactAccordionItem
          key={contact.id}
          id={contact.id}
          title={contact.title}
          trailing={contact.trailing}
          profile={contact.profile}
          href={"href" in contact ? contact.href : undefined}
          onProfileExpand={onProfileExpand}
          onCopyEmail={handleCopyEmail}
          lightbox={lightbox}
        />
      ))}
    </Accordion>
  );
}
