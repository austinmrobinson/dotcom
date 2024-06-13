import Image from "next/image";
import Button from "./components/button";
import { Heading, Text } from "./components/text";
import Link from "next/link";
import AustinLink from "./components/link";
import IconTesla from "./components/icons/tesla";
import IconHP from "./components/icons/hp";
import {
  Box,
  Briefcase,
  Hexagon,
  Linkedin,
  Mail,
  Twitter,
} from "react-feather";
import ImageZoom from "./components/image";
import getCompanies from "./utils/getCompanies";
import { Company } from "./types";
import formatDate from "./utils/formatDate";
import IconPaperCrowns from "./components/icons/paperCrowns";
import Copy from "./components/copy";

interface LinkItemProps {
  href?: string;
  leading: string;
  caption?: string;
  trailing?: string;
  copy?: boolean;
}

function LinkItem({ href, leading, caption, trailing, copy }: LinkItemProps) {
  let icon: React.ReactNode;

  switch (leading) {
    case "Tesla":
      icon = <IconTesla />;
      break;
    case "HP":
      icon = <IconHP />;
      break;
    case "Paper Crowns":
      icon = <IconPaperCrowns />;
      break;
    case "Twitter":
      icon = <Twitter size={16} />;
      break;
    case "Email":
      icon = <Mail size={16} />;
      break;
    case "LinkedIn":
      icon = <Linkedin size={16} />;
      break;
    default:
      icon = <Hexagon size={16} />;
  }

  if (href) {
    return (
      <Link
        href={href}
        className="flex py-1 sm:py-0 gap-4 items-start sm:items-center rounded-xl relative hover:before:bg-neutral-900/10 dark:hover:before:bg-white/10
        before:absolute before:-inset-x-2 before:-inset-y-2 before:transition-colors before:duration-300 before:rounded-xl"
      >
        <div className="flex grow gap-3 items-center">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
            {icon}
          </span>
          <div className="flex flex-col gap-0 sm:flex-row sm:gap-3 grow sm:items-center justify-between">
            <div className="flex grow">
              <Heading size="h6" as="h4" className="grow sm:grow-0">
                {leading}
              </Heading>
              {/* Mobile */}
              <Text className="block sm:hidden tabular-nums min-w-[78px] truncate max-w-full">
                {trailing}
              </Text>
            </div>
            {caption && <Text className="truncate max-w-full">{caption}</Text>}
          </div>
        </div>
        {/* Not Mobile */}
        <Text className="hidden sm:block tabular-nums min-w-[78px]">
          {trailing}
        </Text>
      </Link>
    );
  } else if (copy) {
    return (
      <div
        className="flex py-1 sm:py-0 gap-4 items-start sm:items-center rounded-xl relative hover:before:bg-neutral-900/10 dark:hover:before:bg-white/10
        before:absolute before:-inset-x-2 before:-inset-y-2 before:transition-colors before:duration-300 before:rounded-xl"
      >
        <div className="flex grow gap-3 items-center">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
            {icon}
          </span>
          <div className="flex flex-col gap-0 sm:flex-row sm:gap-3 grow sm:items-center justify-between">
            <div className="flex grow">
              <Heading size="h6" as="h4" className="grow sm:grow-0">
                {leading}
              </Heading>
              {/* Mobile */}
              <Text className="block sm:hidden tabular-nums min-w-[78px] truncate max-w-full">
                {trailing}
              </Text>
            </div>
            {caption && <Text className="truncate max-w-full">{caption}</Text>}
          </div>
        </div>
        {/* Not Mobile */}
        <Text className="hidden sm:block tabular-nums min-w-[78px]">
          {trailing}
        </Text>
      </div>
    );
  } else {
    return (
      <li className="flex py-1 sm:py-0 gap-4 items-start sm:items-center rounded-xl">
        <div className="flex grow gap-3 items-center">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
            {icon}
          </span>
          <div className="flex flex-col gap-0 sm:flex-row sm:gap-3 grow sm:items-center justify-between">
            <div className="flex grow">
              <Heading size="h6" as="h4" className="grow sm:grow-0">
                {leading}
              </Heading>
              {/* Mobile */}
              <Text className="block sm:hidden tabular-nums min-w-[78px] truncate max-w-full">
                {trailing}
              </Text>
            </div>
            {caption && <Text className="truncate max-w-full">{caption}</Text>}
          </div>
        </div>
        {/* Not Mobile */}
        <Text className="hidden sm:block tabular-nums min-w-[78px]">
          {trailing}
        </Text>
      </li>
    );
  }
}

export default async function Home() {
  const companies = await getCompanies();

  let sortedCompanies: Company[] | undefined;
  sortedCompanies = companies?.sort((a, b) => {
    return +new Date(b.startingDate) - +new Date(a.startingDate);
  });

  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      <section id="introduction" className="flex flex-col gap-5 justify-start">
        <Heading size="h1">Austin Robinson</Heading>
        <Text>
          Hi, I am Austin. I am a self-taught software designer and engineer
          living in Austin, Texas. <br></br>Up until recently, I was leading the
          design system at{" "}
          <AustinLink href="https://tesla.com">Tesla</AustinLink>, focusing on
          aligning products across platforms and organizations.
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
        <Button
          href="/projects"
          variant="secondary"
          className="w-full h-10 px-5 xs:w-auto xs:self-start xs:h-8 xs:px-4 mt-2"
        >
          View Work
        </Button>
      </section>
      {/* Open to work */}
      {/* <div className="px-5 py-4 sm:px-7 sm:py-6 rounded-xl flex flex-col gap-2 sm:gap-3 border-2 border-neutral-900/5 dark:border-white/5 items-start">
        <div className="flex flex-col gap-1">
          <Heading size="h4" as="h2">
            Open to Work
          </Heading>
          <Text>
            I am looking for design and design engineering roles. I have
            extensive experience building and leading design systems.
          </Text>
        </div>
        <Copy text="austinrobinsondesign@gmail.com" type="Email">
          <Button as="div" variant="secondary" size="small">
            Contact
          </Button>
        </Copy>
      </div> */}
      <section id="history" className="flex flex-col gap-4 sm:gap-5">
        <div className="flex gap-2 justify-between items-center">
          <Heading size="h3">History</Heading>
        </div>
        <ul className="flex flex-col gap-4">
          {sortedCompanies?.map((company: Company) => (
            <LinkItem
              key={company.slug}
              leading={company.title}
              caption={company.roles[company.roles.length - 1].title}
              trailing={`${formatDate(company.startingDate)}–${
                company.endingDate ? formatDate(company.endingDate) : "Present"
              }`}
            />
          ))}
        </ul>
      </section>
      <section id="contact" className="flex flex-col gap-4 sm:gap-5">
        <Heading size="h3">Connect</Heading>
        <div className="flex flex-col gap-4">
          <LinkItem
            href="https://twitter.com/austinmrobinson"
            leading="Twitter"
            trailing="@austinmrobinson"
          />
          <LinkItem
            href="https://www.linkedin.com/in/robinsonaustin/"
            leading="LinkedIn"
            trailing="robinsonaustin"
          />
          <Copy text="austinrobinsondesign@gmail.com" type="Email">
            <LinkItem
              copy
              leading="Email"
              trailing="austinrobinsondesign@gmail.com"
            />
          </Copy>
        </div>
      </section>
    </div>
  );
}
