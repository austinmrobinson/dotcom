import { IconButton } from "./button";
import { ArrowLeft } from "react-feather";
import { Heading } from "./text";

interface TopOfPageProps {
  back?: string;
  title: string;
  children?: React.ReactNode;
}

export default function TopOfPage({ back, title, children }: TopOfPageProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="flex gap-1 items-center relative">
        {back && (
          <IconButton
            href={back}
            variant="text"
            size="small"
            className="relative left-0 -ml-2 md:absolute md:-left-7"
            absolute
            label="Back"
          >
            <ArrowLeft size="16" />
          </IconButton>
        )}
        <Heading size="h1">{title}</Heading>
      </div>
      {children}
    </div>
  );
}

interface SkeletonTopOfPageProps {
  children?: React.ReactNode;
}

export function SkeletonTopOfPage({ children }: SkeletonTopOfPageProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex gap-2 items-center relative">
        <Heading size="h1" skeleton />
      </div>
      {children}
    </div>
  );
}
