import WorkGrid from "../components/workGrid";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";
import { Suspense } from "react";
import Animate from "../components/animate";
import ProjectGalleryLoading from "./loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Projects() {
  const projects = await getProjects();

  return (
    <Suspense fallback={<ProjectGalleryLoading />}>
      <section className="flex flex-col gap-6">
        <TopOfPage title="Projects" />
        <Animate>{projects && <WorkGrid items={projects} />}</Animate>
      </section>
    </Suspense>
  );
}
