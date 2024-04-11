import { useId } from "react";

interface HeadingProps {
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "caption" | undefined;
  as?: string;
  children?: React.ReactNode;
  className?: string;
  skeleton?: boolean;
  characters?: number;
}

export function Heading({
  size,
  as,
  children,
  skeleton,
  characters,
  className,
}: HeadingProps) {
  const Tag: any = as ?? size;

  let sizeClass;
  let skeletonSizeClass;
  let lineHeightClass;

  // sizeClass = "text-3xl lg:text-4xl";
  // skeletonSizeClass = "h-[1.75rem] lg:h-[2rem]";
  // lineHeightClass = "h-[2.25rem] lg:h-[2.5rem]";

  switch (size) {
    case "h1":
      sizeClass = "text-2xl lg:text-3xl";
      skeletonSizeClass = "h-[1.25rem] lg:h-[1.75rem]";
      lineHeightClass = "h-[2rem] lg:h-[2.25rem]";
      break;
    case "h2":
      sizeClass = "text-lg sm:text-xl lg:text-2xl";
      skeletonSizeClass = "h-[1rem] sm:h-[1.125rem] lg:h-[1.25rem]";
      lineHeightClass = "h-[1.75rem] sm:h-[1.75rem] lg:h-[2rem]";
      break;
    case "h3":
      sizeClass = "text-lg sm:text-lg lg:text-xl";
      skeletonSizeClass = "h-[1rem] sm:h-[1rem] lg:h-[1.125rem]";
      lineHeightClass = "h-[1.75rem] sm:h-[1.75rem] lg:h-[1.75rem]";
      break;
    case "h4":
      sizeClass = "text-base lg:text-lg";
      skeletonSizeClass = "h-[0.75rem] lg:h-[1rem]";
      lineHeightClass = "h-[1.25rem] lg:h-[1.75rem]";
      break;
    case "h5":
      sizeClass = "text-sm lg:text-base";
      skeletonSizeClass = "h-[0.75rem]";
      lineHeightClass = "h-[1.25rem]";
      break;
    default:
      sizeClass = "text-sm";
      skeletonSizeClass = "h-[0.75rem]";
      lineHeightClass = "h-[1.25rem]";
  }

  const skeletonWidth = (characters ?? 8) * 20;

  if (skeleton)
    return (
      <div
        className={`flex flex-col justify-center animate-pulse ${lineHeightClass}`}
      >
        <span
          className={`rounded-full bg-neutral-900/15 dark:bg-white/15 ${skeletonSizeClass}`}
          style={{ width: skeletonWidth }}
        />
      </div>
    );
  return (
    <Tag
      className={`font-medium text-neutral-900 dark:text-white ${sizeClass} ${className}`}
    >
      {children}
    </Tag>
  );
}

interface TextProps extends HeadingProps {
  weight?: "medium" | undefined;
  contrast?: "high" | undefined;
  responsive?: boolean;
}

export function Text({
  size,
  as,
  children,
  weight,
  contrast,
  responsive,
  className,
  skeleton,
  characters,
}: TextProps) {
  const Tag: any = as ?? "p";

  let sizeClass;
  let weightClass;
  let contrastClass;
  let skeletonSizeClass;
  let lineHeightClass;

  switch (size) {
    case "caption":
      sizeClass = "text-xs";
      skeletonSizeClass = "h-[0.5rem]";
      lineHeightClass = "h-[1rem]";
      break;
    default:
      sizeClass = "";
      skeletonSizeClass = "h-[0.675rem]";
      lineHeightClass = "h-[1.25rem]";
  }

  switch (weight) {
    case "medium":
      weightClass = "font-medium";
      break;
    default:
      weightClass = "";
  }

  switch (contrast) {
    case "high":
      contrastClass = "text-neutral-900 dark:text-white";
      break;
    default:
      contrastClass = "";
  }

  const sizeChange = responsive === true ? "text-xs sm:text-sm" : "";
  const skeletonWidth = (characters ?? 8) * 12;

  if (skeleton) {
    return (
      <div
        className={`flex flex-col justify-center animate-pulse ${
          characters && `w-[${skeletonWidth}px]`
        } ${lineHeightClass} ${className}`}
      >
        <span
          className={`w-full rounded-full bg-neutral-900/15 dark:bg-white/15 ${skeletonSizeClass}`}
        />
      </div>
    );
  } else {
    return (
      <Tag
        className={
          sizeClass +
          " " +
          weightClass +
          " " +
          contrastClass +
          " " +
          sizeChange +
          " " +
          className
        }
      >
        {children}
      </Tag>
    );
  }
}

interface SkeletonMultilineTextProps {
  lines: number;
  className?: string;
}

export function SkeletonMultilineText({
  lines,
  className,
}: SkeletonMultilineTextProps) {
  const id = useId();

  return (
    <div className={`flex flex-col gap-0 min-w-40 ${className}`}>
      {[...Array(lines)].map(() => (
        <Text key={id} className="w-full" skeleton />
      ))}
      <Text className="w-[60%]" skeleton />
    </div>
  );
}
