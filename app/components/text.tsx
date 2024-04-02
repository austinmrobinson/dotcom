interface HeadingProps {
  size?: string;
  as?: string;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ size, as, children }: HeadingProps) {
  const Tag: any = as ?? size;

  switch (size) {
    case "h1":
      size = "text-3xl lg:text-4xl";
      break;
    case "h2":
      size = "text-2xl lg:text-3xl";
      break;
    case "h3":
      size = "text-lg sm:text-xl lg:text-2xl";
      break;
    case "h4":
      size = "text-lg sm:text-lg lg:text-xl";
      break;
    case "h5":
      size = "text-sm lg:text-lg";
      break;
    case "h6":
      size = "text-sm";
      break;
  }

  return (
    <Tag className={`font-medium text-neutral-900 dark:text-white ${size}`}>
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
