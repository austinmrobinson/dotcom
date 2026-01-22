import { Button } from "./components/ui/button";
import { Heading, Text } from "./components/text";
import Link from "next/link";
import AustinLink from "./components/link";
import IconTesla from "./components/icons/tesla";
import IconHP from "./components/icons/hp";
import {
  IconHexagon,
  IconBrandLinkedin,
  IconMail,
  IconBrandX,
} from "@tabler/icons-react";
import getCompanies from "./utils/getCompanies";
import { Company } from "./types";
import formatDate from "./utils/formatDate";
import IconPaperCrowns from "./components/icons/paperCrowns";
import Copy from "./components/copy";
import IconNominal from "./components/icons/nominal";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemSeparator,
} from "./components/ui/item";

function getIcon(name: string): React.ReactNode {
  switch (name) {
    case "Nominal":
      return <IconNominal />;
    case "Tesla":
      return <IconTesla />;
    case "HP":
      return <IconHP />;
    case "Paper Crowns":
      return <IconPaperCrowns />;
    case "Twitter":
      return <IconBrandX size={16} stroke={1.5} />;
    case "Email":
      return <IconMail size={16} stroke={1.5} />;
    case "LinkedIn":
      return <IconBrandLinkedin size={16} stroke={1.5} />;
    default:
      return <IconHexagon size={16} stroke={1.5} />;
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
      <section id="introduction" className="flex flex-col gap-5 justify-start">
        <Heading size="h1">Austin Robinson</Heading>
        <Text>
          Hi, I am Austin. I am a self-taught software designer and engineer
          living in Austin, Texas. <br></br>I am currently a design engineer at{" "}
          <AustinLink href="https://nominal.io">Nominal</AustinLink>, where
          we're building software to accelerate hardware testing.
        </Text>
        <Text>
          Before Nominal, I was leading the design system at{" "}
          <AustinLink href="https://tesla.com">Tesla</AustinLink>, focusing on
          aligning products across platforms and organizations.
        </Text>
        <Text>
          Before Tesla, I led design for the design system at{" "}
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
      <section id="history" className="flex flex-col">
        <ItemGroup variant="outline">
          <div className="px-4 py-2 bg-muted">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              History
            </span>
          </div>
          {sortedCompanies?.map((company: Company, index: number) => (
            <div key={company.slug}>
              <ItemSeparator />
              <Item className="hover:bg-accent/50 transition-colors">
                <ItemMedia className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
                  {getIcon(company.title)}
                </ItemMedia>
                <ItemContent className="flex-row items-center gap-3">
                  <ItemTitle>
                    <Heading size="h6" as="h4">
                      {company.title}
                    </Heading>
                  </ItemTitle>
                  <ItemDescription className="hidden sm:block truncate">
                    {company.roles[company.roles.length - 1].title}
                  </ItemDescription>
                </ItemContent>
                <ItemContent className="flex-none">
                  <Text className="tabular-nums text-right whitespace-nowrap">
                    {`${formatDate(company.startingDate)}–${
                      company.endingDate
                        ? formatDate(company.startingDate).substring(0, 2) ===
                          formatDate(company.endingDate).substring(0, 2)
                          ? formatDate(company.endingDate).substring(2)
                          : formatDate(company.endingDate)
                        : "  "
                    }`}
                  </Text>
                </ItemContent>
              </Item>
            </div>
          ))}
        </ItemGroup>
      </section>
      <section id="contact" className="flex flex-col">
        <ItemGroup variant="outline">
          <div className="px-4 py-2 bg-muted">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Connect
            </span>
          </div>
          <ItemSeparator />
          <Link href="https://twitter.com/austinmrobinson">
            <Item className="hover:bg-accent/50 transition-colors">
              <ItemMedia className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
                {getIcon("Twitter")}
              </ItemMedia>
              <ItemContent className="flex-row items-center gap-3">
                <ItemTitle>
                  <Heading size="h6" as="h4">
                    Twitter
                  </Heading>
                </ItemTitle>
              </ItemContent>
              <ItemContent className="flex-none">
                <Text className="tabular-nums text-right">@austinmrobinson</Text>
              </ItemContent>
            </Item>
          </Link>
          <ItemSeparator />
          <Link href="https://www.linkedin.com/in/robinsonaustin/">
            <Item className="hover:bg-accent/50 transition-colors">
              <ItemMedia className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
                {getIcon("LinkedIn")}
              </ItemMedia>
              <ItemContent className="flex-row items-center gap-3">
                <ItemTitle>
                  <Heading size="h6" as="h4">
                    LinkedIn
                  </Heading>
                </ItemTitle>
              </ItemContent>
              <ItemContent className="flex-none">
                <Text className="tabular-nums text-right">robinsonaustin</Text>
              </ItemContent>
            </Item>
          </Link>
          <ItemSeparator />
          <Copy text="austinrobinsondesign@gmail.com" type="Email">
            <Item className="hover:bg-accent/50 transition-colors cursor-pointer">
              <ItemMedia className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-neutral-900/10 dark:border-white/10">
                {getIcon("Email")}
              </ItemMedia>
              <ItemContent className="flex-row items-center gap-3">
                <ItemTitle>
                  <Heading size="h6" as="h4">
                    Email
                  </Heading>
                </ItemTitle>
              </ItemContent>
              <ItemContent className="flex-none">
                <Text className="tabular-nums text-right">
                  austinrobinsondesign@gmail.com
                </Text>
              </ItemContent>
            </Item>
          </Copy>
        </ItemGroup>
      </section>
    </div>
  );
}
