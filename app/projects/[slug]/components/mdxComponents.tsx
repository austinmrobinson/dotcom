import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Heading } from "@/app/components/text";
import ImageZoom, { ImageZoomGallery } from "@/app/components/image";
import Video from "./video";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <Heading size="h2" as="h1">
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading size="h3" as="h2">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading size="h4" as="h3">
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading size="h5" as="h4">
      {children}
    </Heading>
  ),
  h5: ({ children }) => (
    <Heading size="h6" as="h5">
      {children}
    </Heading>
  ),
  a: ({ children, ...props }) => {
    return (
      <Link {...props} href={props.href || ""}>
        {children}
      </Link>
    );
  },
  img: ({ children, ...props }: any) => (
    <ImageZoom
      width="480"
      height="270"
      buttonClassName="my-6 w-full"
      className="w-full object-cover aspect-[16/9] rounded-xl bg-neutral-900/10 dark:bg-white/10 border border-neutral-200/[0.005] dark:border-white/[0.005]"
      {...props}
    />
  ),
  Video,
  ImageZoomGallery,
};
