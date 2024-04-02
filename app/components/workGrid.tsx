import { Project } from "../types";
import WorkItem from "./workItem";

interface WorkGridProps {
  items: Project[];
  type?: string;
}

export default function WorkGrid({ items, type }: WorkGridProps) {
  return (
    <div className="flex flex-col gap-12">
      {items.map((item, index) => (
        <WorkItem key={index} item={item} type={type ?? "post"} />
      ))}
    </div>
  );
}
