import { MDXRemote } from "next-mdx-remote/rsc";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkToc from "remark-toc";
import { mdxComponents } from "./mdxComponents";

export function PostBody({ children }: { children: string }) {
  return (
    <article className="prose prose-neutral prose-sm dark:prose-invert">
      <MDXRemote
        source={children}
        options={{
          mdxOptions: {
            remarkPlugins: [
              // Adds support for GitHub Flavored Markdown
              remarkGfm,
              // generates a table of contents based on headings
              remarkToc,
            ],
            // These work together to add IDs and linkify headings
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
        components={mdxComponents}
      />
    </article>
  );
}
