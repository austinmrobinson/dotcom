"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProfileCard, type ProfilePlatform } from "./profile-card";
import { cn } from "@/app/lib/utils";

export interface ProfileStackItem {
  id: string;
  platform: ProfilePlatform;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bannerClassName?: string;
  href?: string;
  verified?: boolean;
}

interface ProfileCardStackProps {
  profiles: ProfileStackItem[];
  activeId: string;
  className?: string;
  onSelectProfile: (profile: ProfileStackItem) => void;
  onCopyEmail: (email: string) => void;
  activeLayoutId?: string;
  onActiveCardExpand?: () => void;
  isLightboxOpen?: boolean;
}

const stackTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

const cardInteractionTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

type StackTier = 1 | 2 | 3;

const Y_STEP = 28;
const Y_STEP_XL = 36;
const FAN_MULTIPLIER = 1.75;
const FAN_MULTIPLIER_XL = 1.6;
const CARD_PROXIMITY_PX = 48;

function isCursorNearCardCluster(
  x: number,
  y: number,
  elements: HTMLElement[],
  threshold: number
) {
  if (elements.length === 0) return false;

  const rects = elements.map((element) => element.getBoundingClientRect());
  const left = Math.min(...rects.map((rect) => rect.left)) - threshold;
  const top = Math.min(...rects.map((rect) => rect.top)) - threshold;
  const right = Math.max(...rects.map((rect) => rect.right)) + threshold;
  const bottom = Math.max(...rects.map((rect) => rect.bottom)) + threshold;

  return x >= left && x <= right && y >= top && y <= bottom;
}

function useIsXlViewport() {
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    function update() {
      setIsXl(mediaQuery.matches);
    }

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isXl;
}

const STACK_TIER_STYLE = {
  1: { scale: 1, z: 0 },
  2: { scale: 0.93, z: -60 },
  3: { scale: 0.86, z: -120 },
} as const;

interface StackPlacement {
  tier: StackTier;
  scale: number;
  y: number;
  z: number;
  rotateZ: number;
}

function getStackPlacement(
  cardIndex: number,
  activeIndex: number,
  yStep: number,
  fanned: boolean,
  isXlViewport: boolean
): StackPlacement {
  const listOffset = cardIndex - activeIndex;

  if (cardIndex === activeIndex) {
    return { tier: 1, scale: 1, y: 0, z: 0, rotateZ: 0 };
  }

  const distance = Math.abs(listOffset);
  const tier: StackTier = distance === 1 ? 2 : 3;
  const base = STACK_TIER_STYLE[tier];
  const fanMultiplier = fanned
    ? isXlViewport
      ? FAN_MULTIPLIER_XL
      : FAN_MULTIPLIER
    : 1;

  return {
    tier,
    scale: base.scale,
    z: base.z * (fanned ? 1.25 : 1),
    y: listOffset * yStep * fanMultiplier,
    rotateZ: fanned ? listOffset * -5 : 0,
  };
}

interface StackCardProps {
  profile: ProfileStackItem;
  isActive: boolean;
  prefersReducedMotion: boolean | null;
  onSelectProfile: (profile: ProfileStackItem) => void;
  onCopyEmail: (email: string) => void;
  onActiveCardExpand?: () => void;
  activeLayoutId?: string;
  isLightboxOpen?: boolean;
  cardRef?: (node: HTMLButtonElement | null) => void;
}

const layoutTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

function StackCard({
  profile,
  isActive,
  prefersReducedMotion,
  onSelectProfile,
  onCopyEmail,
  onActiveCardExpand,
  activeLayoutId,
  isLightboxOpen,
  cardRef,
}: StackCardProps) {
  function handleClick() {
    if (!isActive) {
      onSelectProfile(profile);
      return;
    }

    if (onActiveCardExpand) {
      onActiveCardExpand();
      return;
    }

    if (profile.platform === "email") {
      onCopyEmail(profile.handle);
      return;
    }

    if (profile.href) {
      window.open(profile.href, "_blank", "noopener,noreferrer");
    }
  }

  const label =
    profile.platform === "email"
      ? isActive
        ? onActiveCardExpand
          ? `Expand email card for ${profile.name}`
          : `Copy ${profile.handle}`
        : `Show email card for ${profile.name}`
      : isActive
        ? onActiveCardExpand
          ? `Expand ${profile.platform} profile for ${profile.name}`
          : `Open ${profile.platform} profile for ${profile.name}`
        : `Show ${profile.platform} profile for ${profile.name}`;

  const sharedLayoutId =
    isActive &&
    activeLayoutId &&
    !prefersReducedMotion &&
    !isLightboxOpen
      ? activeLayoutId
      : undefined;

  const cardClassName = cn(
    "pointer-events-auto w-full max-w-[400px] text-left xl:max-w-[480px]",
    isActive && onActiveCardExpand ? "cursor-zoom-in" : "cursor-pointer"
  );

  const cardContent = <ProfileCard {...profile} />;

  if (prefersReducedMotion) {
    return (
      <button
        ref={cardRef}
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={cardClassName}
      >
        {cardContent}
      </button>
    );
  }

  if (sharedLayoutId) {
    return (
      <motion.button
        ref={cardRef}
        type="button"
        layoutId={sharedLayoutId}
        transition={layoutTransition}
        onClick={handleClick}
        aria-label={label}
        className={cardClassName}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ y: 2, scale: 0.98 }}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={cardClassName}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ y: 2, scale: 0.98 }}
      transition={cardInteractionTransition}
    >
      {cardContent}
    </motion.button>
  );
}

export function ProfileCardStack({
  profiles,
  activeId,
  className,
  onSelectProfile,
  onCopyEmail,
  activeLayoutId,
  onActiveCardExpand,
  isLightboxOpen,
}: ProfileCardStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const isXlViewport = useIsXlViewport();
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [isNearCards, setIsNearCards] = useState(false);
  const yStep = isXlViewport ? Y_STEP_XL : Y_STEP;
  const fanned = isNearCards && !prefersReducedMotion;
  const activeIndex = Math.max(
    0,
    profiles.findIndex((profile) => profile.id === activeId)
  );

  const setCardRef = useCallback(
    (id: string) => (node: HTMLButtonElement | null) => {
      if (node) {
        cardRefs.current.set(id, node);
      } else {
        cardRefs.current.delete(id);
      }
    },
    []
  );

  function updateNearCards(clientX: number, clientY: number) {
    const near = isCursorNearCardCluster(
      clientX,
      clientY,
      Array.from(cardRefs.current.values()),
      CARD_PROXIMITY_PX
    );
    setIsNearCards(near);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    updateNearCards(event.clientX, event.clientY);
  }

  function handlePointerLeave() {
    setIsNearCards(false);
  }

  return (
    <div
      data-preview-target
      className={cn(
        "relative flex aspect-video w-full min-w-0 items-center justify-center rounded-xl bg-profile-preview",
        fanned ? "overflow-visible" : "overflow-hidden",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="relative size-full [perspective:1400px]">
        {profiles.map((profile, index) => {
          const placement = getStackPlacement(
            index,
            activeIndex,
            yStep,
            fanned,
            isXlViewport
          );
          const isActive = profile.id === activeId;
          const zIndex = profiles.length + 1 - placement.tier;

          if (prefersReducedMotion) {
            if (!isActive && !fanned) return null;

            return (
              <div
                key={profile.id}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ zIndex }}
              >
                <StackCard
                  profile={profile}
                  isActive={isActive}
                  prefersReducedMotion={prefersReducedMotion}
                  onSelectProfile={onSelectProfile}
                  onCopyEmail={onCopyEmail}
                  onActiveCardExpand={onActiveCardExpand}
                  activeLayoutId={activeLayoutId}
                  isLightboxOpen={isLightboxOpen}
                  cardRef={setCardRef(profile.id)}
                />
              </div>
            );
          }

          return (
            <motion.div
              key={profile.id}
              className="pointer-events-none absolute inset-0 flex origin-center items-center justify-center [transform-style:preserve-3d]"
              initial={false}
              animate={{
                scale: placement.scale,
                y: placement.y,
                z: placement.z,
                rotateZ: placement.rotateZ,
                opacity: 1,
              }}
              transition={stackTransition}
              style={{ zIndex }}
            >
              <StackCard
                profile={profile}
                isActive={isActive}
                prefersReducedMotion={prefersReducedMotion}
                onSelectProfile={onSelectProfile}
                onCopyEmail={onCopyEmail}
                onActiveCardExpand={onActiveCardExpand}
                activeLayoutId={activeLayoutId}
                isLightboxOpen={isLightboxOpen}
                cardRef={setCardRef(profile.id)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
