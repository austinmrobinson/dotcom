"use client";

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
  verified?: boolean;
}

interface ProfileCardStackProps {
  profiles: ProfileStackItem[];
  activeId: string;
  className?: string;
}

const stackTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

type StackTier = 1 | 2 | 3;

const Y_STEP = 36;

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
}

function getStackPlacement(
  cardIndex: number,
  activeIndex: number
): StackPlacement {
  if (cardIndex === activeIndex) {
    return { tier: 1, scale: 1, y: 0, z: 0 };
  }

  const listOffset = cardIndex - activeIndex;
  const distance = Math.abs(listOffset);
  const tier: StackTier = distance === 1 ? 2 : 3;
  const base = STACK_TIER_STYLE[tier];

  return {
    tier,
    scale: base.scale,
    z: base.z,
    y: listOffset * Y_STEP,
  };
}

export function ProfileCardStack({
  profiles,
  activeId,
  className,
}: ProfileCardStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = Math.max(
    0,
    profiles.findIndex((profile) => profile.id === activeId)
  );

  return (
    <div
      className={cn(
        "relative flex aspect-video w-full min-w-0 items-center justify-center overflow-hidden rounded-xl bg-profile-preview",
        className
      )}
    >
      <div className="relative size-full [perspective:1400px]">
        {profiles.map((profile, index) => {
          const placement = getStackPlacement(index, activeIndex);
          const isFront = placement.tier === 1;

          if (prefersReducedMotion) {
            if (!isFront) return null;

            return (
              <div
                key={profile.id}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ProfileCard {...profile} />
              </div>
            );
          }

          return (
            <motion.div
              key={profile.id}
              className={cn(
                "absolute inset-0 flex origin-center items-center justify-center [transform-style:preserve-3d]",
                !isFront && "pointer-events-none"
              )}
              initial={false}
              animate={{
                scale: placement.scale,
                y: placement.y,
                z: placement.z,
                opacity: 1,
              }}
              transition={stackTransition}
              style={{ zIndex: profiles.length + 1 - placement.tier }}
            >
              <ProfileCard {...profile} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
