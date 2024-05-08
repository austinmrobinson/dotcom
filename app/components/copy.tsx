"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Text } from "./text";
import copyToClipboard from "../utils/copyToClipboard";
import { useState } from "react";
import { AlertCircle, Check } from "react-feather";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export default function Copy({ children, text }: TooltipProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function copy(text: string) {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2400);
    } catch {
      setError(true);
    }
  }

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={copied}>
        <RadixTooltip.Trigger onClick={() => copy(text)} className="text-start">
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          {!error ? (
            <RadixTooltip.Content
              className="z-50 flex gap-1 items-center select-none rounded-full bg-neutral-900 dark:bg-white px-2 py-[2px]  will-change-[transform,opacity] text-white dark:text-neutral-900"
              sideOffset={4}
            >
              <Check
                className="text-green-500 dark:text-green-300"
                size={12}
                strokeWidth={3}
              />
              <Text size="caption">Copied to Clipboard</Text>
            </RadixTooltip.Content>
          ) : (
            <RadixTooltip.Content
              className="z-50 flex gap-1 items-center select-none rounded-full bg-neutral-900 dark:bg-white px-2 py-[2px]  will-change-[transform,opacity] text-white dark:text-neutral-900"
              sideOffset={4}
            >
              <AlertCircle
                className="text-red-500 dark:text-red-300"
                size={12}
                strokeWidth={3}
              />
              <Text size="caption">Failed to Copy</Text>
            </RadixTooltip.Content>
          )}
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
