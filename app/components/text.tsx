interface HeadingProps {
  size?: string;
  as?: string;
  children: React.ReactNode;
  className?: string;
  skeleton?: boolean;
}

export function Heading({ size, as, children, skeleton }: HeadingProps) {
  const Tag: any = as ?? size;

  let sizeClass;

  switch (size) {
    case "h1":
      sizeClass = "text-3xl lg:text-4xl";
      break;
    case "h2":
      sizeClass = "text-2xl lg:text-3xl";
      break;
    case "h3":
      sizeClass = "text-lg sm:text-xl lg:text-2xl";
      break;
    case "h4":
      sizeClass = "text-lg sm:text-lg lg:text-xl";
      break;
    case "h5":
      sizeClass = "text-sm lg:text-lg";
      break;
    case "h6":
      sizeClass = "text-sm";
      break;
  }

  if (skeleton) return <span className="animate-pulse " />;
  return (
    <Tag
      className={`font-medium text-neutral-900 dark:text-white ${sizeClass}`}
    >
      {children}
    </Tag>
  );
}

interface TextProps extends HeadingProps {
  weight?: string;
  contrast?: string;
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
}: TextProps) {
  const Tag: any = as ?? "p";

  switch (size) {
    case "caption":
      size = "text-xs";
      break;
    default:
      size = "";
  }

  switch (weight) {
    case "medium":
      weight = "font-medium";
      break;
    default:
      weight = "";
  }

  switch (contrast) {
    case "high":
      contrast = "text-neutral-900 dark:text-white";
      break;
    default:
      contrast = "";
  }

  const sizeChange = responsive === true ? "text-xs sm:text-sm" : "";

  return (
    <Tag
      className={
        size +
        " " +
        weight +
        " " +
        contrast +
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
