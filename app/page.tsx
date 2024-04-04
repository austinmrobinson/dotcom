import Image from "next/image";
import Button from "./components/button";
import { Heading, Text } from "./components/text";
import Link from "next/link";
import AustinLink from "./components/link";
import IconTesla from "./components/icons/tesla";
import IconHP from "./components/icons/hp";
import { Mail, Twitter } from "react-feather";
import ImageZoom from "./components/image";

interface LinkItemProps {
  href: string;
  icon: React.ReactNode;
  leading: string;
  caption?: string;
  trailing: string;
}

function LinkItem({ href, icon, leading, caption, trailing }: LinkItemProps) {
  return (
    <Link
      href={href}
      className="flex gap-12 items-center rounded-xl relative hover:before:bg-neutral-900/10 dark:hover:before:bg-white/10
        before:absolute before:-inset-x-2 before:-inset-y-2 before:transition-colors before:duration-300 before:rounded-xl"
    >
      <div className="flex grow gap-3 items-center">
        <span className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
          {icon}
        </span>
        <Heading size="h6" as="h4">
          {leading}
        </Heading>
      </div>
      <div className="flex gap-3">
        {caption && <Text weight="medium">{caption}</Text>}
        <Text className="tabular-nums min-w-[64px]">{trailing}</Text>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section id="introduction" className="flex flex-col gap-5">
        <Heading size="h1">Austin Robinson</Heading>
        <Text>
          Hi, I am Austin. I am a self-taught software designer and engineer
          living in Austin, Texas. Currently, I am building the design system at{" "}
          <AustinLink href="https://tesla.com">Tesla</AustinLink>.
        </Text>
        <Text>
          Before my time at Tesla, I led design for the design system at{" "}
          <AustinLink href="https://hp.com">HP</AustinLink>. Our team worked on
          a ground-up redesign that scaled the system across the company and to
          multiple platforms.
        </Text>
        <Text>
          For a long time, I moonlighted as a designer and front-end developer
          for{" "}
          <AustinLink href="https://papercrowns.com/">Paper Crowns</AustinLink>{" "}
          and my own company, working on projects for companies like Activision
          and Supercell.
        </Text>
      </section>
      <section id="history" className="flex flex-col gap-5">
        <div className="flex gap-2 justify-between items-center">
          <Heading size="h3">Work History</Heading>
          <Button
            variant="text"
            size="small"
            href="/projects"
            className="-mr-3"
          >
            View Work
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <LinkItem
            href="/projects"
            icon={<IconTesla />}
            leading="Tesla"
            caption="Staff UX Designer, Design Systems"
            trailing="2021–"
          />
          <LinkItem
            href="/projects"
            icon={<IconHP />}
            leading="HP"
            caption="Design Lead, Design Systems"
            trailing="2017–21"
          />
        </div>
      </section>
      <section id="contact" className="flex flex-col gap-5">
        <Heading size="h3">Contact</Heading>
        <div className="flex flex-col gap-4">
          <LinkItem
            href="https://twitter.com/austinmrobinson"
            icon={<Twitter size={16} />}
            leading="Twitter"
            trailing="@austinmrobinson"
          />
          <LinkItem
            href="mailto:austinrobinsondesign@gmail.com"
            icon={<Mail size={16} />}
            leading="Email"
            trailing="austinrobinsondesign@gmail.com"
          />
        </div>
      </section>
    </div>
  );
}
