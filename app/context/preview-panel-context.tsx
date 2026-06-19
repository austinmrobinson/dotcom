"use client";

import { createContext, useContext, type RefObject } from "react";

export interface MediaPanelContent {
  type: "media";
  workIndex: number;
}

export interface ProfilePanelContent {
  type: "profile";
  id: string;
  platform: "twitter" | "linkedin" | "email";
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bannerClassName?: string;
  href?: string;
  verified?: boolean;
}

export interface OgPanelContent {
  type: "og";
  href: string;
}

export type PanelContent =
  | MediaPanelContent
  | OgPanelContent
  | ProfilePanelContent;

export interface PreviewPanelContextValue {
  panel: PanelContent | null;
  mediaIndex: number;
  carouselRef: RefObject<HTMLDivElement | null>;
  activateWork: (index: number) => void;
  activateHref: (href: string) => void;
  activateProfile: (content: Omit<ProfilePanelContent, "type">) => void;
  setMediaIndex: (index: number) => void;
  clearDeselectTimer: () => void;
  startDeselectTimer: () => void;
  isWorkActive: (index: number) => boolean;
  isHrefActive: (href: string) => boolean;
  isProfileActive: (id: string) => boolean;
}

export const PreviewPanelContext =
  createContext<PreviewPanelContextValue | null>(null);

export function usePreviewPanelOptional() {
  return useContext(PreviewPanelContext);
}
