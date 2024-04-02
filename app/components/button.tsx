const { default: Link } = require("next/link");

interface ButtonProps {
  variant?: string;
  size?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  absolute?: boolean;
  type?: string;
  onClick?: any;
}

export const IconButton = ({
  variant,
  size,
  href,
  children,
  className,
  absolute,
  onClick,
}: ButtonProps) => {
  switch (variant) {
    case "secondary":
      variant =
        "text-neutral-900 bg-neutral-900/10 hover:before:bg-neutral-900/20 dark:text-white dark:bg-white/10 dark:hover:before:bg-white/20";
      break;
    case "tertiary":
      variant =
        "text-neutral-700 border border-neutral-900/20 hover:text-neutral-900 hover:before:bg-neutral-900/10 hover:border-neutral-900/30 dark:text-neutral-300 dark:border-white/20 dark:hover:text-white dark:hover:before:bg-white/10 dark:hover:border-white/30";
      break;
    case "text":
      variant =
        "text-neutral-700 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-300 dark:hover:text-white dark:hover:before:bg-white/10";
      break;
    default:
      variant =
        "text-white bg-neutral-900 hover:before:bg-white/20 dark:text-neutral-900 dark:bg-white dark:hover:before:bg-neutral-900/20";
      break;
  }

  switch (size) {
    case "medium":
      size = "h-8 w-8";
      break;
    case "small":
      size = "h-7 w-7";
    default:
      size = "h-10 w-10";
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
          variant +
          " " +
          size +
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
        onClick={onClick}
        className={
          baseStyles +
          " " +
          variant +
          " " +
          size +
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
  switch (variant) {
    case "secondary":
      variant =
        "text-neutral-900 bg-neutral-900/10 hover:before:bg-neutral-900/20 dark:text-white dark:bg-white/10 dark:hover:before:bg-white/20";
      break;
    case "tertiary":
      variant =
        "text-neutral-700 border border-neutral-900/20 hover:text-neutral-900 hover:before:bg-neutral-900/10 hover:border-neutral-900/30 dark:text-neutral-300 dark:border-white/20 dark:hover:text-white dark:hover:before:bg-white/10 dark:hover:border-white/30";
      break;
    case "text":
      variant =
        "text-neutral-700 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-300 dark:hover:text-white dark:hover:before:bg-white/10";
      break;
    default:
      variant =
        "text-white bg-neutral-900 hover:before:bg-white/20 dark:text-neutral-900 dark:bg-white dark:hover:before:bg-neutral-900/20";
      break;
  }

  switch (size) {
    case "medium":
      size = "h-8 px-4";
      break;
    case "small":
      size = "h-7 px-3";
    default:
      size = "h-10 px-5";
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
          variant +
          " " +
          size +
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
        className={
          baseStyles +
          " " +
          variant +
          " " +
          size +
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
