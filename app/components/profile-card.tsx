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
        "relative mx-auto w-full max-w-[400px] overflow-visible p-3 xl:max-w-[480px] xl:p-4",
        className
      )}
    >
      <div className="relative aspect-video w-full rounded-[20px] shadow-profile-card xl:rounded-[24px]">
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] bg-profile-card-surface xl:rounded-[24px]">
          <div
            className={cn(
              "relative h-12 shrink-0 overflow-hidden rounded-t-[10px] xl:h-16 xl:rounded-t-[12px]",
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
                "absolute top-2.5 right-2.5 flex items-center justify-center rounded-full p-2 xl:top-3.5 xl:right-3.5 xl:p-2.5",
                iconBadgeClassName
              )}
            >
              <PlatformIcon
                className={cn("size-3.5 xl:size-4", iconClassName)}
                aria-hidden
              />
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col justify-end px-5 pb-5 xl:px-8 xl:pb-8">
            <div className="pointer-events-none absolute -top-6 left-5 z-10 size-16 overflow-hidden rounded-full border-[5px] border-profile-card-avatar-border bg-skeleton image-outline xl:-top-8 xl:left-8 xl:size-20 xl:border-[6px]">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1280px) 80px, 64px"
                priority
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-8 xl:gap-2 xl:pt-10">
              <p className="font-serif text-xl font-normal leading-snug tracking-[-0.4px] text-card-foreground xl:text-2xl xl:tracking-[-0.48px]">
                {name}
              </p>

              <div className="w-fit max-w-full rounded-full bg-profile-card-handle px-3 py-0.5 xl:px-3.5 xl:py-1">
                <span className="block truncate text-sm text-text-secondary xl:text-base">
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
