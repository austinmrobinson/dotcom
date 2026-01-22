"use client";

import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { cn } from "@/app/utils/index";

interface CopyProps {
  children: React.ReactNode;
  text: string;
  type?: string;
  className?: string;
}

export default function Copy({ children, text, type, className }: CopyProps) {
  const [, copy] = useCopyToClipboard();

  async function copyToClipboard(text: string) {
    copy(text)
      .then(() => {
        toast.success(`Copied${type ? ` ${type}` : ""}`);
      })
      .catch((error) => {
        toast.error("Failed to copy");
        console.error("Failed to copy!", error);
      });
  }

  return (
    <button
      onClick={() => copyToClipboard(text)}
      className={cn(
        "text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className
      )}
    >
      {children}
    </button>
  );
}
