import Animate from "../components/animate";
import TopOfPage from "../components/topOfPage";
import { SkeletonWorkGrid } from "../components/workGrid";

export default function ProjectGalleryLoading() {
  return (
    <Animate className="flex flex-col gap-6">
      <TopOfPage title="Projects" />
      <SkeletonWorkGrid />
    </Animate>
  );
}
