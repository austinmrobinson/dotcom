import matter from "gray-matter";
import path from "path";
import fs from "fs/promises";
import { cache } from "react";
import { Project } from "../types";

// `cache` is a React 18 feature that allows you to cache a function for the lifetime of a request.
// this means getProjects() will only be called once per page build, even though we may call it multiple times
// when rendering the page.
export const getProjects = cache(async () => {
  let projects;

  try {
    projects = await fs.readdir("content/projects");
  } catch (error) {
    console.error(error);
  }

  if (projects) {
    return Promise.all(
      projects
        .filter((file) => path.extname(file) === ".mdx")
        .map(async (file) => {
          const filePath = `content/projects/${file}`;
          const postContent = await fs.readFile(filePath, "utf8");
          const { data, content } = matter(postContent);

          if (data.published === false) {
            return null;
          }

          return { ...data, body: content } as any;
        })
    );
  } else {
    console.log("Projects not found");
  }
});

export async function getProject(slug: string) {
  let projects;

  try {
    projects = await getProjects();
  } catch (error) {
    console.error(error);
  }

  if (projects) {
    const project = projects.find((project: Project) => project.slug === slug);
    return project;
  } else {
    console.log("Project not found");
  }
}

export default getProjects;
