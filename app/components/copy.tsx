"use client";

import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

interface CopyProps {
  children: React.ReactNode;
  text: string;
  type?: string;
}

export default function Copy({ children, text, type }: CopyProps) {
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
      className="text-start rounded-xl p-2 -m-2"
    >
      {children}
    </button>
  );
}
