"use client";

import Image from "next/image";
import {
  RiVerifiedBadgeFill,
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
  platform: Exclude<ProfilePlatform, "email">;
}

function SocialProfileCard({
  platform,
  name,
  handle,
  avatar,
  banner,
  bannerClassName = "bg-black",
  className,
}: SocialProfileCardProps) {
  const {
    icon: PlatformIcon,
    iconBadgeClassName,
    iconClassName,
  } = platformConfig[platform];

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[480px] overflow-visible p-4",
        className
      )}
    >
      <div className="relative aspect-video w-full rounded-[24px] shadow-profile-card">
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[24px] border-hairline border-border-subtle bg-profile-card-surface">
          <div
            className={cn(
              "relative h-16 shrink-0 overflow-hidden rounded-t-[12px]",
              !banner && bannerClassName
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[40px] border-hairline border-border-light"
      />
    </div>
  );
}

function EmailProfileCard({
  name,
  handle,
  avatar,
  banner,
  bannerClassName = "bg-muted-foreground",
  verified,
}: ProfileCardBaseProps) {
  const { icon: PlatformIcon, label: platformLabel } = platformConfig.email;

  return (
    <div className="w-full rounded-2xl border-hairline border-border-light bg-background p-6 sm:p-8">
      <div className="relative flex aspect-video w-full flex-col overflow-hidden rounded-xl border-hairline border-border-hairline bg-background">
        <div
          className={cn(
            "relative h-[40%] shrink-0",
            !banner && bannerClassName
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
          <div className="absolute top-5 right-5 flex items-center gap-2 text-white/90">
            <PlatformIcon className="size-7" aria-hidden />
            <span className="text-sm font-medium">{platformLabel}</span>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col px-8 pb-8">
          <div className="absolute -top-14 left-8 size-28 overflow-hidden rounded-full border-[5px] border-background bg-skeleton shadow-sm">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover object-top"
              sizes="112px"
              priority
            />
          </div>

          <div className="mt-[4.25rem] flex min-w-0 flex-col gap-1.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-2xl font-bold leading-tight text-foreground">
                {name}
              </span>
              {verified && (
                <RiVerifiedBadgeFill
                  className="size-6 shrink-0 text-[#1d9bf0]"
                  aria-label="Verified"
                />
              )}
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <PlatformIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <span className="truncate text-base text-muted-foreground">
                {handle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ platform, ...props }: ProfileCardProps) {
  if (platform === "email") {
    return <EmailProfileCard {...props} />;
  }

  const { bannerClassName: platformBannerClassName } = platformConfig[platform];

  return (
    <SocialProfileCard
      platform={platform}
      {...props}
      bannerClassName={props.bannerClassName ?? platformBannerClassName}
    />
  );
}
