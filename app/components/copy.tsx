"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Text } from "./text";
import { useState } from "react";
import { AlertCircle, Check } from "react-feather";
import { useCopyToClipboard } from "usehooks-ts";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  type?: string;
}

export default function Copy({ children, text, type }: TooltipProps) {
  const [copiedText, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function copyToClipboard(text: string) {
    copy(text)
      .then(() => {
        setCopied(true);
        console.log("Copied!", { text });
        setTimeout(() => {
          setCopied(false);
        }, 2400);
      })
      .catch((error) => {
        setError(true);
        console.error("Failed to copy!", error);
      });
  }

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={copied}>
        <RadixTooltip.Trigger
          onClick={() => copyToClipboard(text)}
          className="text-start"
        >
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          {!error ? (
            <RadixTooltip.Content
              className="z-50 flex gap-1 items-center select-none rounded-full bg-neutral-900 dark:bg-white px-2 py-[2px]  will-change-[transform,opacity] text-white dark:text-neutral-900"
              sideOffset={4}
            >
              <Check
                className="text-green-300 dark:text-green-500"
                size={12}
                strokeWidth={3}
              />
              <Text size="caption">Copied{type && ` ${type}`}</Text>
            </RadixTooltip.Content>
          ) : (
            <RadixTooltip.Content
              className="z-50 flex gap-1 items-center select-none rounded-full bg-neutral-900 dark:bg-white px-2 py-[2px]  will-change-[transform,opacity] text-white dark:text-neutral-900"
              sideOffset={4}
            >
              <AlertCircle
                className="text-red-300 dark:text-red-500"
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
