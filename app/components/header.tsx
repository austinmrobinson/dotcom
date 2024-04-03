"use client";

import Link from "next/link";
import { Moon, Sun } from "react-feather";
import { IconButton } from "./button";
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

  return (
    <header className="fixed flex gap-3 px-4 py-3 h-14 items-center bg-neutral-100/80 backdrop-blur-md md:bg-transparent md:backdrop-filter-none left-0 top-0 right-0 z-10 dark:bg-neutral-900/80">
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
                    ? "text-neutral-900 bg-neutral-900/5 dark:text-white dark:bg-white/5"
                    : ""
                } relative font-medium flex items-center px-4 h-8 rounded-full text-neutral-600 transition-colors duration-300 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white`}
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
                      className="absolute bg-neutral-900/10 dark:bg-white/10 inset-0 rounded-full h-8 z-0"
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
        <IconButton variant="text" size="medium">
          <Sun size="16" strokeWidth="2.5" />
        </IconButton>
      </div> */}
    </header>
  );
}
