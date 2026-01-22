import { Button } from "./components/ui/button";
import { Heading, Text } from "./components/text";
import Link from "next/link";
import Image from "next/image";
import AustinLink from "./components/link";
import IconTesla from "./components/icons/tesla";
import IconHP from "./components/icons/hp";
import { IconHexagon, IconBrandLinkedin, IconMail, IconBrandX, IconArrowRight } from "@tabler/icons-react";
import getCompanies from "./utils/getCompanies";
import { Company } from "./types";
import formatDate from "./utils/formatDate";
import IconPaperCrowns from "./components/icons/paperCrowns";
import Copy from "./components/copy";
import IconNominal from "./components/icons/nominal";

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
    case "Nominal":
      icon = <IconNominal />;
      break;
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
      icon = <IconBrandX size={16} stroke={1.5} />;
      break;
    case "Email":
      icon = <IconMail size={16} stroke={1.5} />;
      break;
    case "LinkedIn":
      icon = <IconBrandLinkedin size={16} stroke={1.5} />;
      break;
    default:
      icon = <IconHexagon size={16} stroke={1.5} />;
  }

  if (href) {
    return (
      <Link
        href={href}
        className="flex py-1 sm:py-0 gap-4 items-start sm:items-center rounded-xl relative hover:before:bg-overlay-light
        before:absolute before:-inset-x-2 before:-inset-y-2 before:transition-colors before:duration-300 before:rounded-xl"
      >
        <div className="flex grow gap-3 items-center">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-border-light">
            {icon}
          </span>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3 grow sm:items-center justify-between">
            <div className="flex justify-between min-w-0">
              <Heading size="h6" as="h4" className="shrink-0">
                {leading}
              </Heading>
              {/* Mobile */}
              <Text className="block sm:hidden tabular-nums min-w-[60px] text-right shrink truncate ml-3">
                {trailing}
              </Text>
            </div>
            {caption && <Text className="truncate max-w-full">{caption}</Text>}
          </div>
        </div>
        {/* Not Mobile */}
        <Text className="hidden sm:block tabular-nums min-w-[60px]">
          {trailing}
        </Text>
      </Link>
    );
  } else if (copy) {
    return (
      <div
        className="flex py-1 sm:py-0 gap-4 items-start sm:items-center rounded-xl relative hover:before:bg-overlay-light
        before:absolute before:-inset-x-2 before:-inset-y-2 before:transition-colors before:duration-300 before:rounded-xl"
      >
        <div className="flex grow gap-3 items-center">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-border-light">
            {icon}
          </span>
          <div className="flex flex-col gap-0 sm:flex-row sm:gap-3 grow sm:items-center justify-between">
            <div className="flex justify-between min-w-0">
              <Heading size="h6" as="h4" className="shrink-0">
                {leading}
              </Heading>
              {/* Mobile */}
              <Text className="block sm:hidden tabular-nums min-w-[60px] text-right shrink truncate ml-3">
                {trailing}
              </Text>
            </div>
            {caption && <Text className="truncate max-w-full">{caption}</Text>}
          </div>
        </div>
        {/* Not Mobile */}
        <Text className="hidden sm:block tabular-nums min-w-[60px]">
          {trailing}
        </Text>
      </div>
    );
  } else {
    return (
      <li className="flex py-1 sm:py-0 gap-4 items-start sm:items-center rounded-xl">
        <div className="flex grow gap-3 items-center">
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-border-light">
            {icon}
          </span>
          <div className="flex flex-col gap-0 sm:flex-row sm:gap-3 grow sm:items-center justify-between">
            <div className="flex justify-between min-w-0">
              <Heading size="h6" as="h4" className="shrink-0">
                {leading}
              </Heading>
              {/* Mobile */}
              <Text className="block sm:hidden tabular-nums min-w-[60px] text-right shrink truncate ml-3">
                {trailing}
              </Text>
            </div>
            {caption && <Text className="truncate max-w-full">{caption}</Text>}
          </div>
        </div>
        {/* Not Mobile */}
        <Text className="hidden sm:block tabular-nums min-w-[60px]">
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
    // Sort companies with no ending date first
    if (!a.endingDate && b.endingDate) return -1;
    if (a.endingDate && !b.endingDate) return 1;

    // For companies with same ending date status (both null or both have dates)
    // sort by starting date, most recent first
    return +new Date(b.startingDate) - +new Date(a.startingDate);
  });

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
        <Button href="/projects" variant="secondary" className="self-start mt-2">
          View Work
          <IconArrowRight size={16} stroke={2} />
        </Button>
      </section>
      {/* Open to work */}
      {/* <div className="px-5 py-4 sm:px-7 sm:py-6 rounded-xl flex flex-col gap-2 sm:gap-3 border-2 border-border-subtle items-start">
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
                company.endingDate
                  ? formatDate(company.startingDate).substring(0, 2) ===
                    formatDate(company.endingDate).substring(0, 2)
                    ? formatDate(company.endingDate).substring(2)
                    : formatDate(company.endingDate)
                  : "  "
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
