import WorkGrid from "../components/workGrid";
import getProjects from "../utils/getProjects";
import TopOfPage from "../components/topOfPage";
import Animate from "../components/animate";
import { Metadata } from "next";
import { Project } from "../types";
import { Heading, Text } from "../components/text";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import Copy from "../components/copy";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Projects() {
  const projects = await getProjects();

  let sortedProjects: Project[] | undefined;
  sortedProjects = projects
    ?.filter((project: Project) => project.published === true)
    .sort((a, b) => {
      return +new Date(b.date) - +new Date(a.date);
    });

  return (
    <section className="flex flex-col gap-6">
      <TopOfPage title="Projects" />
      <Animate className="flex flex-col gap-16">
        {sortedProjects && <WorkGrid items={sortedProjects} />}
        <Card>
          <CardHeader>
            <CardTitle>More Coming Soon</CardTitle>
            <CardDescription>
              I have over 30 projects to share across my roles at Tesla, HP,
              and Paper Crowns. These projects show my experience with
              design systems and engineering. Please contact me if you would
              like to see more!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Copy text="austinrobinsondesign@gmail.com" type="Email">
              <Button variant="secondary" size="sm" render={<div />} nativeButton={false}>
                Contact
              </Button>
            </Copy>
          </CardContent>
        </Card>
      </Animate>
    </section>
  );
}
