"use client";

import type { CSSProperties, ReactNode } from "react";
import { RiTwitterXFill, RiLinkedinFill } from "@remixicon/react";
import { cn } from "@/app/lib/utils";

export type ProfilePlatform = "twitter" | "linkedin" | "email";

function iconBannerRadial(stops: string) {
  return `radial-gradient(ellipse 85% 115% at 50% 100%, ${stops})`;
}

const bannerStyles = {
  email: {
    backgroundColor: "var(--profile-card-banner-base)",
    backgroundImage: iconBannerRadial(
      "var(--profile-card-banner-highlight) 0%, var(--profile-card-banner-base) 100%"
    ),
  },
  twitter: {
    backgroundColor:
      "color-mix(in srgb, #000 5%, var(--profile-card-surface-bg))",
    backgroundImage: iconBannerRadial(
      "rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%"
    ),
  },
  linkedin: {
    backgroundColor:
      "color-mix(in srgb, #0a66c2 5%, var(--profile-card-surface-bg))",
    backgroundImage: iconBannerRadial(
      "rgba(10, 102, 194, 0.1) 0%, rgba(10, 102, 194, 0.05) 100%"
    ),
  },
} as const satisfies Record<ProfilePlatform, CSSProperties>;

const platformAppConfig = {
  twitter: {
    iconClassName: "bg-black text-white",
    Icon: RiTwitterXFill,
  },
  linkedin: {
    iconClassName: "bg-[#0a66c2] text-white",
    Icon: RiLinkedinFill,
  },
} as const;

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

interface ProfileCardFrameProps {
  className?: string;
  bannerStyle?: CSSProperties;
  hero: ReactNode;
  footer: ReactNode;
}

function ProfileCardFrame({
  className,
  bannerStyle = bannerStyles.email,
  hero,
  footer,
}: ProfileCardFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[400px] overflow-visible p-3 xl:max-w-[480px] xl:p-4",
        className
      )}
    >
      <div className="relative aspect-video w-full rounded-[20px] shadow-profile-card dark:shadow-raised-container-lg xl:rounded-[24px]">
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[20px] bg-profile-card-surface xl:rounded-[24px]">
          <div className="relative min-h-0 flex-1 px-2 pt-2">
            <div
              className="relative h-full rounded-[12px] border border-border-light dark:shadow-container"
              style={bannerStyle}
            />
            <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
              {hero}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-end justify-center px-5 pb-5 xl:px-8 xl:pb-8">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileHandlePill({
  handle,
  className,
}: {
  handle: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-fit max-w-full rounded-full bg-profile-card-handle px-3 py-0.5 xl:px-3.5 xl:py-1",
        className
      )}
    >
      <span className="block truncate text-sm text-text-secondary xl:text-base">
        {handle}
      </span>
    </div>
  );
}

function PlatformAppIcon({
  platform,
  className,
}: {
  platform: keyof typeof platformAppConfig;
  className?: string;
}) {
  const { Icon, iconClassName } = platformAppConfig[platform];

  return (
    <div
      className={cn(
        "flex size-[78px] items-center justify-center rounded-[18px] shadow-profile-card dark:shadow-raised-container-sm xl:size-[98px] xl:rounded-[22px]",
        iconClassName,
        className
      )}
    >
      <Icon className="size-9 xl:size-11" aria-hidden />
    </div>
  );
}

function EmailEnvelopeIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[54px] w-[83px] xl:h-[68px] xl:w-[104px]",
        className
      )}
    >
      <div className="absolute inset-[-36.03%_-46.63%_-106.62%_-46.63%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/email-envelope.svg"
          alt=""
          className="block size-full max-w-none dark:brightness-[0.72] dark:saturate-0"
        />
      </div>
    </div>
  );
}

function EmailProfileCard({
  handle,
  className,
}: {
  handle: string;
  className?: string;
}) {
  return (
    <ProfileCardFrame
      className={className}
      bannerStyle={bannerStyles.email}
      hero={<EmailEnvelopeIllustration />}
      footer={<ProfileHandlePill handle={handle} />}
    />
  );
}

function SocialProfileCard({
  platform,
  handle,
  className,
}: {
  platform: keyof typeof platformAppConfig;
  handle: string;
  className?: string;
}) {
  return (
    <ProfileCardFrame
      className={className}
      bannerStyle={bannerStyles[platform]}
      hero={<PlatformAppIcon platform={platform} />}
      footer={<ProfileHandlePill handle={handle} />}
    />
  );
}

export function ProfileCard({ platform, ...props }: ProfileCardProps) {
  if (platform === "email") {
    return (
      <EmailProfileCard handle={props.handle} className={props.className} />
    );
  }

  return (
    <SocialProfileCard
      platform={platform}
      handle={props.handle}
      className={props.className}
    />
  );
}
