import Link from "next/link";
import formatDate, { formatDateMonth } from "../utils/formatDate";
import { Heading, Text } from "./text";
import Image from "next/image";
import { Project } from "../types";

interface WorkItemProps {
  item: any;
  type: "company" | "project" | undefined;
  skeleton?: boolean;
}

export default function WorkItem({ item, type, skeleton }: WorkItemProps) {
  let route;

  switch (type) {
    case "company":
      route = "companies";
    default:
      route = "projects";
      break;
  }

  if (skeleton) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-4 h-full">
          <div className="w-full aspect-[16/9] rounded-xl animate-pulse bg-neutral-900/10 dark:bg-white/10"></div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 items-center justify-between">
              <Heading size="h4" skeleton />
              <Text skeleton />
            </div>
            <Text skeleton />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Link
        href={`/${route}/${item.slug}`}
        className="w-full relative before:absolute before:-inset-3 before:transition-all before:duration-300 before:opacity-0 before:scale-95 before:rounded-3xl hover:before:scale-100 hover:before:opacity-100 hover:before:bg-neutral-900/10 dark:hover:before:bg-white/10"
      >
        <article className="flex flex-col gap-4 h-full" key={item.slug}>
          <figure className="relative">
            <span className="absolute top-2 left-2 flex items-center text-sm justify-center text-neutral-700 px-2 py-[2px] rounded-md bg-neutral-300">
              {item.company}
            </span>
            <Image
              width="640"
              height="360"
              className="w-full object-cover aspect-[16/9] border border-neutral-200/[0.005] dark:border-white/[0.005] rounded-xl bg-neutral-900/10 dark:bg-white/10"
              src={item.thumbnail.src ?? "/placeholder-image.jpg"}
              alt={
                item.thumbnail.alt ??
                "Placeholder backup with a photo landscape icon in the middle"
              }
            />
          </figure>
          <header className="flex flex-col gap-1">
            <div className="flex gap-3 items-center justify-between">
              <Heading size="h4" as="h3">
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
}
