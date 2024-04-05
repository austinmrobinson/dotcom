import WorkGrid from "../components/workGrid";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";
import { Suspense } from "react";
import Animate from "../components/animate";
import ProjectGalleryLoading from "./loading";
import { Metadata } from "next";
import { Project } from "../types";
import { newGetProjects } from "../utils/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Projects() {
  const projects = await newGetProjects();

  console.log(projects);

  let sortedProjects: any | undefined;
  sortedProjects = projects?.sort((a, b) => {
    return +new Date(b.metadata.date) - +new Date(a.metadata.date);
  });

  return (
    <Suspense fallback={<ProjectGalleryLoading />}>
      <section className="flex flex-col gap-6">
        <TopOfPage title="Projects" />
        <Animate>
          {sortedProjects && <WorkGrid items={sortedProjects} />}
        </Animate>
      </section>
    </Suspense>
  );
}
