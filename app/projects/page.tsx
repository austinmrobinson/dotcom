import WorkGrid from "../components/workGrid";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";
import { Suspense } from "react";
import Animate from "../components/animate";
import ProjectGalleryLoading from "./loading";
import { Metadata } from "next";
import AuthContext from "../components/authContext";
import { Project } from "../types";
import { Heading, Text } from "../components/text";
import Button from "../components/button";
import Copy from "../components/copy";

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
          <Animate className="flex flex-col gap-16">
            {sortedProjects && <WorkGrid items={sortedProjects} />}
            <div className="px-6 py-6 sm:px-9 sm:py-8 rounded-xl flex flex-col gap-4 border-2 border-neutral-900/5 dark:border-white/5 items-start">
              <div className="flex flex-col gap-1">
                <Heading size="h4" as="h2">
                  More Coming Soon
                </Heading>
                <Text>
                  I have over 30 projects to share across my roles at Tesla, HP,
                  and Paper Crowns. These projects show my experience with
                  design systems and engineering. Please contact me if you would
                  like to see more!
                </Text>
              </div>
              <Copy text="austinrobinsondesign@gmail.com" type="Email">
                <Button as="div" variant="secondary" size="small">
                  Contact
                </Button>
              </Copy>
            </div>
          </Animate>
        </section>
      </Suspense>
    </AuthContext>
  );
}
