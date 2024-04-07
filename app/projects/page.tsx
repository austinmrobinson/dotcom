import WorkGrid from "../components/workGrid";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";
import { Suspense } from "react";
import Animate from "../components/animate";
import ProjectGalleryLoading from "./loading";
import { Metadata } from "next";
import AuthContext from "../components/authContext";
import { sortDesc } from "../utils/sort";
import { SelectorGroup } from "../components/selector";
import { Project } from "../types";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Projects() {
  const projects = await getProjects();

  // let selectedCategory: any;

  // let filteredProjects = projects;
  // // If "all" -> show all, else -> filter
  // switch (selectedCategory) {
  //   case "all":
  //     filteredProjects = projects;
  //     break;
  //   default:
  //     filteredProjects = projects?.filter((project) =>
  //       project?.categories?.some(
  //         (category: string) => category === selectedCategory
  //       )
  //     );
  //     break;
  // }
  // // Sorts projects newest -> oldest
  // const sortedProjects = sortDesc(filteredProjects);

  let sortedProjects: Project[] | undefined;
  sortedProjects = projects?.sort((a, b) => {
    return +new Date(b.date) - +new Date(a.date);
  });

  return (
    <AuthContext>
      <Suspense fallback={<ProjectGalleryLoading />}>
        <section className="flex flex-col gap-6">
          <TopOfPage title="Projects" />
          <form></form>
          <Animate>
            {sortedProjects && <WorkGrid items={sortedProjects} />}
          </Animate>
        </section>
      </Suspense>
    </AuthContext>
  );
}
