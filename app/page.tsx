"use client";

import { useState, useEffect } from "react";
import { Heading, Text } from "./components/text";
import Link from "next/link";
import Image from "next/image";
import AustinLink from "./components/link";
import Copy from "./components/copy";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconMail,
  IconBrandX,
  IconBrandLinkedin,
  IconArrowUpRight,
  IconCopy,
} from "@tabler/icons-react";
import { ActivitySection } from "./components/activity";

const iconVariants = {
  initial: { scale: 0.5, opacity: 0, filter: "blur(4px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: { scale: 0.5, opacity: 0, filter: "blur(4px)" },
};

const textVariants = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
};

const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);
  return canHover;
}

interface CTACardContentProps {
  isActive: boolean;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  hoverSubtitle: string;
}

function CTACardContent({
  isActive,
  icon,
  activeIcon,
  title,
  subtitle,
  hoverSubtitle,
}: CTACardContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const currentIconVariants = prefersReducedMotion ? reducedMotionVariants : iconVariants;
  const currentTextVariants = prefersReducedMotion ? reducedMotionVariants : textVariants;
  const transitionDuration = prefersReducedMotion ? 0 : 0.15;

  return (
    <>
      <span className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center rounded-full bg-overlay-light sm:mb-auto relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {isActive ? (
            <motion.span
              key="action"
              variants={currentIconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: transitionDuration }}
              className="absolute"
            >
              {activeIcon}
            </motion.span>
          ) : (
            <motion.span
              key="default"
              variants={currentIconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: transitionDuration }}
              className="absolute"
            >
              {icon}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <div className="flex flex-col w-full min-w-0 overflow-hidden sm:mt-6">
        <Heading size="h6" as="span">
          {title}
        </Heading>
        <div className="relative h-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {isActive ? (
              <motion.div
                key="hover"
                variants={currentTextVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: transitionDuration }}
                className="absolute w-full"
              >
                <Text className="truncate">{hoverSubtitle}</Text>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                variants={currentTextVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: transitionDuration }}
                className="absolute w-full"
              >
                <Text className="truncate">{subtitle}</Text>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

interface CTACardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  hoverSubtitle: string;
}

function CTACard({ href, icon, title, subtitle, hoverSubtitle }: CTACardProps) {
  const [isActive, setIsActive] = useState(false);
  const canHover = useCanHover();

  return (
    <Link
      href={href}
      className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 sm:justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-[0.5px] border-border-medium flex-1 min-w-0 hover:bg-overlay-subtle transition-colors"
      onMouseEnter={() => canHover && setIsActive(true)}
      onMouseLeave={() => canHover && setIsActive(false)}
      onFocus={() => canHover && setIsActive(true)}
      onBlur={() => canHover && setIsActive(false)}
    >
      <CTACardContent
        isActive={isActive}
        icon={icon}
        activeIcon={<IconArrowUpRight size={20} stroke={1.5} />}
        title={title}
        subtitle={subtitle}
        hoverSubtitle={hoverSubtitle}
      />
    </Link>
  );
}

interface CopyCTACardProps {
  text: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  hoverSubtitle: string;
}

function CopyCTACard({ text, icon, title, subtitle, hoverSubtitle }: CopyCTACardProps) {
  const [isActive, setIsActive] = useState(false);
  const canHover = useCanHover();

  return (
    <Copy
      text={text}
      type="Email"
      onFocus={() => canHover && setIsActive(true)}
      onBlur={() => canHover && setIsActive(false)}
    >
      <div
        className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 sm:justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-[0.5px] border-border-medium flex-1 min-w-0 hover:bg-overlay-subtle transition-colors h-full cursor-pointer"
        onMouseEnter={() => canHover && setIsActive(true)}
        onMouseLeave={() => canHover && setIsActive(false)}
      >
        <CTACardContent
          isActive={isActive}
          icon={icon}
          activeIcon={<IconCopy size={20} stroke={1.5} />}
          title={title}
          subtitle={subtitle}
          hoverSubtitle={hoverSubtitle}
        />
      </div>
    </Copy>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      <section id="introduction" className="flex flex-col gap-4 justify-start">
        <div className="w-14 h-14 relative rounded-full overflow-hidden shrink-0 mb-2 bg-skeleton">
          <Image
            src="/austin.jpg"
            alt="Austin Robinson"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <Heading size="h1">Austin Robinson</Heading>
          <Text>Design at Nominal</Text>
        </div>
        <Text>
          I'm a software designer and engineer living in Austin, TX, currently
          building software to accelerate hardware testing at{" "}
          <AustinLink href="https://nominal.io">Nominal</AustinLink>.
        </Text>
        <Text>
          Previously, I led design systems at{" "}
          <AustinLink href="https://tesla.com">Tesla</AustinLink> and{" "}
          <AustinLink href="https://hp.com">HP</AustinLink>, and moonlighted as
          a designer and engineer for{" "}
          <AustinLink href="https://papercrowns.com/">Paper Crowns</AustinLink>.
        </Text>
      </section>
      <section id="activity">
        <ActivitySection />
      </section>
      <section id="contact" className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <CopyCTACard
          text="austinrobinsondesign@gmail.com"
          icon={<IconMail size={20} stroke={1.5} />}
          title="Email"
          subtitle="austinrobinsondesign@gmail.com"
          hoverSubtitle="Copy email"
        />
        <CTACard
          href="https://twitter.com/austinmrobinson"
          icon={<IconBrandX size={20} stroke={1.5} />}
          title="Twitter"
          subtitle="@austinmrobinson"
          hoverSubtitle="Navigate"
        />
        <CTACard
          href="https://www.linkedin.com/in/robinsonaustin/"
          icon={<IconBrandLinkedin size={20} stroke={1.5} />}
          title="LinkedIn"
          subtitle="/robinsonaustin"
          hoverSubtitle="Navigate"
        />
      </section>
    </div>
  );
}
