import Tooltip from "./tooltip";

const { default: Link } = require("next/link");

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "large" | "medium" | "small";
  href?: string;
  children: React.ReactNode;
  className?: string;
  absolute?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: any;
}

interface IconButtonProps extends ButtonProps {
  label: string;
}

export const IconButton = ({
  variant,
  size,
  href,
  children,
  className,
  absolute,
  onClick,
  type,
  label,
}: IconButtonProps) => {
  let variantClass;
  let sizeClass;

  switch (variant) {
    case "secondary":
      variantClass =
        "text-neutral-900 bg-neutral-900/10 hover:before:bg-neutral-900/20 dark:text-white dark:bg-white/10 dark:hover:before:bg-white/20";
      break;
    case "tertiary":
      variantClass =
        "text-neutral-700 border border-neutral-900/20 hover:text-neutral-900 hover:before:bg-neutral-900/10 hover:border-neutral-900/30 dark:text-neutral-300 dark:border-white/20 dark:hover:text-white dark:hover:before:bg-white/10 dark:hover:border-white/30";
      break;
    case "text":
      variantClass =
        "text-neutral-700 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-300 dark:hover:text-white dark:hover:before:bg-white/10";
      break;
    default:
      variantClass =
        "text-white bg-neutral-900 hover:before:bg-white/20 dark:text-neutral-900 dark:bg-white dark:hover:before:bg-neutral-900/20";
      break;
  }

  switch (size) {
    case "medium":
      sizeClass = "h-8 w-8";
      break;
    case "small":
      sizeClass = "h-7 w-7";
      break;
    default:
      sizeClass = "h-10 w-10";
  }

  const baseStyles =
    "overflow-hidden font-medium transition-colors duration-300 rounded-full flex items-center justify-center before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-full before:scale-75 hover:before:scale-100";

  const position = absolute === true ? "absolute" : "relative";

  if (href) {
    return (
      <Tooltip label={label}>
        <Link
          href={href}
          className={
            baseStyles +
            " " +
            variantClass +
            " " +
            sizeClass +
            " " +
            className +
            " " +
            position
          }
        >
          {children}
        </Link>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip label={label}>
        <button
          onClick={onClick}
          type={type}
          className={
            baseStyles +
            " " +
            variantClass +
            " " +
            sizeClass +
            " " +
            className +
            " " +
            position
          }
        >
          {children}
        </button>
      </Tooltip>
    );
  }
};

export default function Button({
  variant,
  size,
  href,
  children,
  className,
  absolute,
  type,
}: ButtonProps) {
  let variantClass;
  let sizeClass;

  switch (variant) {
    case "secondary":
      variantClass =
        "text-neutral-900 bg-neutral-900/10 hover:before:bg-neutral-900/20 dark:text-white dark:bg-white/10 dark:hover:before:bg-white/20";
      break;
    case "tertiary":
      variantClass =
        "text-neutral-700 border border-neutral-900/20 hover:text-neutral-900 hover:before:bg-neutral-900/10 hover:border-neutral-900/30 dark:text-neutral-300 dark:border-white/20 dark:hover:text-white dark:hover:before:bg-white/10 dark:hover:border-white/30";
      break;
    case "text":
      variantClass =
        "text-neutral-700 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-300 dark:hover:text-white dark:hover:before:bg-white/10";
      break;
    default:
      variantClass =
        "text-white bg-neutral-900 hover:before:bg-white/20 dark:text-neutral-900 dark:bg-white dark:hover:before:bg-neutral-900/20";
      break;
  }

  switch (size) {
    case "medium":
      sizeClass = "h-8 px-4";
      break;
    case "small":
      sizeClass = "h-7 px-3";
      break;
    default:
      sizeClass = "h-10 px-5";
  }

  const baseStyles =
    "overflow-hidden font-medium transition-colors duration-300 rounded-full flex items-center justify-center before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-full before:scale-75 hover:before:scale-100";

  const position = absolute === true ? "absolute" : "relative";

  if (href) {
    return (
      <Link
        href={href}
        className={
          baseStyles +
          " " +
          variantClass +
          " " +
          sizeClass +
          " " +
          className +
          " " +
          position
        }
      >
        {children}
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        className={
          baseStyles +
          " " +
          variantClass +
          " " +
          sizeClass +
          " " +
          className +
          " " +
          position
        }
      >
        {children}
      </button>
    );
  }
}
