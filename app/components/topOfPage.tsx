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
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center relative">
        {back && (
          <IconButton
            href={back}
            variant="text"
            size="medium"
            className="absolute -left-10"
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center relative">
        <Heading size="h1" skeleton />
      </div>
      {children}
    </div>
  );
}
