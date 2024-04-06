import { Project } from "../types";
import Animate from "./animate";
import WorkItem from "./workItem";

interface WorkGridProps {
  items: Project[];
  type?: "company" | "project" | undefined;
  skeleton?: boolean;
}

export default function WorkGrid({ items, type, skeleton }: WorkGridProps) {
  return (
    <div className="flex flex-col gap-12">
      {items.map((item, index) => (
        <WorkItem key={index} item={item} type={type ?? "project"} />
      ))}
    </div>
  );
}

export function SkeletonWorkGrid() {
  const blankItem: Project = {
    title: "",
    date: "",
    subtitle: "",
    slug: "",
    thumbnail: { src: "", alt: "" },
  };

  return (
    <Animate>
      <div className="flex flex-col gap-12">
        {[0, 1, 2, 3].map((index) => (
          <WorkItem key={index} item={blankItem} type="project" skeleton />
        ))}
      </div>
    </Animate>
  );
}
