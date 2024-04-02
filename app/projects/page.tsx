import WorkGrid from "../components/workGrid";
import { Heading } from "../components/text";
import Button from "../components/button";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section className="flex flex-col gap-6">
      <TopOfPage title="Projects" />
      <WorkGrid items={projects} />
      {/* <Button
        href="/work/freelance"
        variant="tertiary"
        size="medium"
        className="mt-4 self-center"
      >
        See More
      </Button> */}
    </section>
  );
}
