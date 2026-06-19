"use client";

import Image from "next/image";
import {
  RiTwitterXFill,
  RiLinkedinFill,
  RiMailFill,
} from "@remixicon/react";
import { cn } from "@/app/lib/utils";

export type ProfilePlatform = "twitter" | "linkedin" | "email";

const platformConfig = {
  twitter: {
    icon: RiTwitterXFill,
    label: "X",
    bannerClassName: "bg-black",
    iconBadgeClassName: "bg-overlay-white",
    iconClassName: "text-white/50",
  },
  linkedin: {
    icon: RiLinkedinFill,
    label: "LinkedIn",
    bannerClassName: "bg-[#0a66c2]",
    iconBadgeClassName: "bg-overlay-white",
    iconClassName: "text-white/50",
  },
  email: {
    icon: RiMailFill,
    label: "Email",
    bannerClassName: "bg-muted-foreground",
    iconBadgeClassName: "bg-overlay-white",
    iconClassName: "text-white/50",
  },
} satisfies Record<
  ProfilePlatform,
  {
    icon: typeof RiTwitterXFill;
    label: string;
    bannerClassName: string;
    iconBadgeClassName: string;
    iconClassName: string;
  }
>;

export interface ProfileCardProps {
  platform: ProfilePlatform;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bannerClassName?: string;
  verified?: boolean;
  className?: string;
}

interface ProfileCardBaseProps extends Omit<ProfileCardProps, "platform"> {
  className?: string;
}

interface SocialProfileCardProps extends ProfileCardBaseProps {
  platform: ProfilePlatform;
}

function SocialProfileCard({
  platform,
  name,
  handle,
  avatar,
  banner,
  bannerClassName,
  className,
}: SocialProfileCardProps) {
  const {
    icon: PlatformIcon,
    iconBadgeClassName,
    iconClassName,
    bannerClassName: platformBannerClassName,
  } = platformConfig[platform];

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[480px] overflow-visible p-4",
        className
      )}
    >
      <div className="relative aspect-video w-full rounded-[24px] shadow-profile-card">
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[24px] bg-profile-card-surface">
          <div
            className={cn(
              "relative h-16 shrink-0 overflow-hidden rounded-t-[12px]",
              !banner && (bannerClassName ?? platformBannerClassName)
            )}
          >
            {banner && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            )}

            <div
              className={cn(
                "absolute top-3.5 right-3.5 flex items-center justify-center rounded-full p-2.5",
                iconBadgeClassName
              )}
            >
              <PlatformIcon className={cn("size-4", iconClassName)} aria-hidden />
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col justify-end px-8 pb-8">
            <div className="pointer-events-none absolute -top-8 left-8 z-10 size-20 overflow-hidden rounded-full border-[6px] border-profile-card-avatar-border bg-skeleton image-outline">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="80px"
                priority
              />
            </div>

            <div className="flex flex-col gap-2 pt-10">
              <p className="font-serif text-2xl font-normal leading-snug tracking-[-0.48px] text-card-foreground">
                {name}
              </p>

              <div className="w-fit max-w-full rounded-full bg-profile-card-handle px-3.5 py-1">
                <span className="block truncate text-base text-text-secondary">
                  {handle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ platform, ...props }: ProfileCardProps) {
  const { bannerClassName: platformBannerClassName } = platformConfig[platform];

  return (
    <SocialProfileCard
      platform={platform}
      {...props}
      bannerClassName={props.bannerClassName ?? platformBannerClassName}
    />
  );
}
