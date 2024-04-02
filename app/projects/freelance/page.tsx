import WorkTimeline from "../../components/workTimeline";
import TopOfPage from "../../components/topOfPage";
import getProjects from "@/app/utils/getProjects";
import GroupByYear from "@/app/utils/groupByYear";

export default async function Work() {
  let projects;

  setTimeout(async () => {
    projects = await getProjects();
  }, 3000);

  // @ts-ignore
  const postsByYear = GroupByYear(projects);

  return (
    <div className="flex flex-col gap-12">
      <TopOfPage title="Freelance" back="/projects" />
      <section className="flex flex-col gap-6">
        <WorkTimeline items={postsByYear} />
      </section>
    </div>
  );
}
