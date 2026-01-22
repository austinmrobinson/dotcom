"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/app/components/ui/tooltip";
import { Text } from "./text";
import { useState } from "react";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useCopyToClipboard } from "usehooks-ts";

interface CopyProps {
  children: React.ReactNode;
  text: string;
  type?: string;
}

export default function Copy({ children, text, type }: CopyProps) {
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
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger
          onClick={() => copyToClipboard(text)}
          className="text-start rounded-xl p-2 -m-2"
        >
          {children}
        </TooltipTrigger>
        <TooltipContent className="flex gap-1 items-center">
          {!error ? (
            <>
              <IconCheck
                className="text-success"
                size={12}
                stroke={3}
              />
              <Text size="caption">Copied{type && ` ${type}`}</Text>
            </>
          ) : (
            <>
              <IconAlertCircle
                className="text-destructive"
                size={12}
                stroke={3}
              />
              <Text size="caption">Failed to Copy</Text>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
