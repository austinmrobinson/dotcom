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
            className="z-50 select-none rounded-[3px] bg-yellow-1050 dark:bg-yellow-50 px-2 py-[2px] font-medium  will-change-[transform,opacity] text-yellow-50 dark:text-yellow-1050"
            sideOffset={4}
          >
            <Text size="caption">{label}</Text>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
