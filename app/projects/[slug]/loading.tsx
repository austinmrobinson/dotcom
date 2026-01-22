import Animate from "@/app/components/animate";
import { Heading, SkeletonMultilineText, Text } from "@/app/components/text";
import { SkeletonTopOfPage } from "@/app/components/topOfPage";

export default function ProjectPageLoading() {
  return (
    <Animate className="flex flex-col gap-12">
      <SkeletonTopOfPage>
        <Text skeleton characters={24} />
      </SkeletonTopOfPage>
      <div
        className="rounded-none md:rounded-xl bg-overlay-light
max-w-[767px] w-[100vw] aspect-[16/9] self-center"
      ></div>
      <div className="flex flex-col gap-4">
        <Heading size="h3" skeleton />
        <SkeletonMultilineText lines={5} />
      </div>
    </Animate>
  );
}
