import Link from "next/link";
import formatDate, { formatDateMonth } from "../utils/formatDate";
import { Heading, Text } from "./text";
import Image from "next/image";
import { Project } from "../types";

interface WorkItemProps {
  item: Project;
  type: string;
}

export default function WorkItem({ item, type }: WorkItemProps) {
  switch (type) {
    case "company":
      type = "companies";
    default:
      type = "projects";
      break;
  }

  return (
    <Link
      href={`/${type}/${item.slug}`}
      className="w-full relative before:absolute before:-inset-3 before:transition-all before:duration-300 before:opacity-0 before:scale-95 before:rounded-3xl hover:before:scale-100 hover:before:opacity-100 hover:before:bg-neutral-900/10"
    >
      <article className="flex flex-col gap-4 h-full" key={item.slug}>
        <figure>
          <Image
            width="216"
            height="120"
            className="w-full object-cover aspect-[16/9] rounded-xl bg-neutral-900/10 dark:bg-white/10"
            src={item.thumbnail.src ?? null}
            alt={item.thumbnail.alt ?? null}
          />
        </figure>
        <header className="flex flex-col gap-1">
          <div className="flex gap-3 items-center justify-between">
            <Heading size="h5" as="h3">
              {item.title}
            </Heading>
            <Text className="shrink-0">{formatDateMonth(item.date)}</Text>
          </div>
          <Text className="max-h-10 line-clamp-2">{item.subtitle}</Text>
        </header>
      </article>
    </Link>
  );
}
