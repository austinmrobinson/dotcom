"use client";

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  label: string;
}

export default function Tooltip({ children, label }: TooltipProps) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger render={children as React.ReactElement}>
      </TooltipTrigger>
      <TooltipContent>
        {label}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
