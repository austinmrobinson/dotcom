"use client";

import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

interface CopyProps {
  children: React.ReactNode;
  text: string;
  type?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function Copy({ children, text, type, onFocus, onBlur }: CopyProps) {
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
      onFocus={onFocus}
      onBlur={onBlur}
      className="flex text-start w-full min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {children}
    </button>
  );
}
