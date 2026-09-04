import type { Metadata } from "next";
import { RunNav } from "@/app/features/run/components/RunNav";

export const metadata: Metadata = {
  title: "Run",
  description: "Running activities and race history",
};

export default function RunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
      <RunNav />
      {children}
    </div>
  );
}
