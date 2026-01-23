"use client";

import Link from "next/link";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { IconButton } from "@/app/components/ui/button";
import Logo from "./logo";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavLogo = () => {
  return (
    <IconButton href="/" variant="text" size="medium" label="Home">
      <Logo />
    </IconButton>
  );
};

export default function Header() {
  const pathname = usePathname();

  const [focused, setFocused] = useState<String | null>();

  type NavItem = {
    href: string;
    title: string;
  };

  const navItems: NavItem[] = [
    { href: "work", title: "Work" },
    { href: "about", title: "About" },
  ];

  const isHomepage = pathname === "/";

  return (
    <header
      className={`fixed gap-3 px-4 py-3 h-14 items-center bg-background/80 backdrop-blur-md sm:bg-transparent sm:backdrop-filter-none left-0 top-0 right-0 z-10 ${
        isHomepage ? "hidden sm:flex" : "flex"
      }`}
    >
      <div className="flex-grow">
        <NavLogo />
      </div>
      {/* <nav>
        <ul className="flex" onMouseLeave={() => setFocused(null)}>
          {navItems.map((item: NavItem, index) => (
            <li key={index}>
              <Link
                className={`${
                  pathname.includes("/" + item.href)
                    ? "text-foreground bg-overlay-subtle"
                    : ""
                } relative font-medium flex items-center px-4 h-8 rounded-full text-text-secondary transition-colors duration-300 hover:text-foreground`}
                href={item.href}
                passHref
                onFocus={() => setFocused(item.href)}
                onMouseEnter={() => setFocused(item.href)}
              >
                {item.title}
                <AnimatePresence>
                  {focused === item.href ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        layout: {
                          duration: 0.2,
                          ease: "easeOut",
                        },
                      }}
                      className="absolute bg-overlay-light inset-0 rounded-full h-8 z-0"
                      layoutId="highlight"
                    />
                  ) : null}
                </AnimatePresence>
              </Link>
            </li>
          ))}
        </ul>
      </nav> */}
      {/* <div className="flex flex-grow justify-end">
        <IconButton variant="text" size="medium" label="Toggle theme">
          <IconSun size={16} stroke={2.5} />
        </IconButton>
      </div> */}
    </header>
  );
}
