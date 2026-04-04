import { Project } from "../types";
import { Badge } from "./ui/badge";
import WorkItem from "./workItem";

interface WorkYearProps {
  year: Date;
  items: Project[];
}

const WorkYear = ({ year, items }: WorkYearProps) => {
  const formattedDate = new Date(year);

  return (
    <div className="flex gap-6">
      <div className="relative flex flex-col items-center">
        <Badge variant="outline" className="sticky z-0 mb-9 top-20 h-8 px-4 rounded-full">
          <h2>
            {formattedDate.toLocaleDateString("en-US", {
              year: "numeric",
            })}
          </h2>
        </Badge>
        <span className="absolute -z-10 inset-y-0 w-[1px] bg-border-medium" />
      </div>
      <div className="mt-14 mb-9 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-6">
        {items.map((item, index) => (
          <WorkItem key={index} item={item} type="project" />
        ))}
      </div>
    </div>
  );
};

interface WorkTimelineProps {
  items: any[];
}

export default function WorkTimeline({ items }: WorkTimelineProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <WorkYear key={index} year={item.year} items={item.items} />
      ))}
    </div>
  );
}
