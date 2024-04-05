import matter from "gray-matter";
import path from "path";
import fs from "fs/promises";
import { cache } from "react";
import { Company } from "../types";

// `cache` is a React 18 feature that allows you to cache a function for the lifetime of a request.
// this means getProjects() will only be called once per page build, even though we may call it multiple times
// when rendering the page.
export const getCompanies = cache(async () => {
  let companies;

  try {
    companies = await fs.readdir(
      path.resolve(process.cwd(), "content", "companies")
    );
  } catch (error) {
    console.error(error);
  }

  if (companies) {
    return Promise.all(
      companies
        .filter((file) => path.extname(file) === ".mdx")
        .map(async (file) => {
          const filePath = `content/companies/${file}`;
          const postContent = await fs.readFile(filePath, "utf8");
          const { data, content } = matter(postContent);

          if (data.published === false) {
            return null;
          }

          return { ...data, body: content } as any;
        })
    );
  } else {
    console.log("Companies not found");
  }
});

export default getCompanies;
