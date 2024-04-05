import WorkGrid from "../components/workGrid";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";
import { Suspense } from "react";
import Animate from "../components/animate";
import ProjectGalleryLoading from "./loading";
import { Metadata } from "next";
import { Project } from "../types";
import PasswordForm from "../components/passwordForm";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Projects() {
  const projects = await getProjects();

  // console.log(projects);

  let sortedProjects: Project[] | undefined;
  sortedProjects = projects?.sort((a, b) => {
    return +new Date(b.date) - +new Date(a.date);
  });

  const cookiesStore = cookies();
  const loginCookies = cookiesStore.get(process.env.PASSWORD_COOKIE_NAME!);
  const isLoggedIn = !!loginCookies?.value;

  if (!isLoggedIn) {
    return <PasswordForm />;
  } else {
    return (
      <Suspense
        fallback={!isLoggedIn ? <PasswordForm /> : <ProjectGalleryLoading />}
      >
        <section className="flex flex-col gap-6">
          <TopOfPage title="Projects" />
          <Animate>
            {sortedProjects && <WorkGrid items={sortedProjects} />}
          </Animate>
        </section>
      </Suspense>
    );
  }
}
