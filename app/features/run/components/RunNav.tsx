"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";

const runNavItems = [
  { href: "/run", label: "Overview", exact: true },
  { href: "/run/activities", label: "Activities", exact: false },
  { href: "/run/races", label: "Races", exact: false },
] as const;

export function RunNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-2">
      {runNavItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
