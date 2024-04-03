import Link from "next/link";
import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { Heading } from "@/app/components/text";

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
  img: ({ children, ...props }) => (
    // @ts-expect-error
    <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...props} />
  ),
};
