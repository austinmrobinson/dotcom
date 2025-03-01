"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Text } from "./text";
import Animate from "./animate";

interface TooltipProps {
  children: React.ReactNode;
  label: string;
}

export default function Tooltip({ children, label }: TooltipProps) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="z-50 select-none rounded-full bg-neutral-900 dark:bg-white px-2 py-[2px]  will-change-[transform,opacity] text-white dark:text-neutral-900"
            sideOffset={4}
          >
            <Text size="caption">{label}</Text>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
