import React from "react";
import Tooltip from "./tooltip";
import clsx from "clsx";
import { cn } from "../utils/cn";

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
  disabled?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

interface IconButtonProps extends ButtonProps {
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    let variantClass;
    let sizeClass;

    switch (props.variant) {
      case "secondary":
        variantClass =
          "text-yellow-1050 bg-yellow-1050/10 hover:before:bg-yellow-1050/20 dark:text-yellow-50 dark:bg-yellow-50/10 dark:hover:before:bg-yellow-50/20";
        break;
      case "tertiary":
        variantClass =
          "text-yellow-1050/90 border border-yellow-1050/20 hover:text-yellow-1050 hover:before:bg-yellow-1050/10 hover:border-yellow-1050/6030 dark:text-yellow-50/60 dark:border-yellow-50/20 dark:hover:text-yellow-50 dark:hover:before:bg-yellow-50/10 dark:hover:border-yellow-50/30";
        break;
      case "text":
        variantClass =
          "text-yellow-1050/90 hover:text-yellow-1050 hover:before:bg-yellow-1050/10 dark:text-yellow-50/60 dark:hover:text-yellow-50 dark:hover:before:bg-yellow-50/10";
        break;
      default:
        variantClass =
          "text-yellow-50 bg-yellow-1050 hover:before:bg-yellow-50/20 dark:text-yellow-1050 dark:bg-yellow-50 dark:hover:before:bg-yellow-1050/20";
        break;
    }

    switch (props.size) {
      case "medium":
        sizeClass = "h-8 w-8";
        break;
      case "small":
        sizeClass = "h-7 w-7";
        break;
      default:
        sizeClass = "h-10 w-10";
    }

    const baseStyles = `overflow-hidden font-medium transition-colors duration-300 rounded-[3px] flex items-center justify-center before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-[3px] before:scale-75 hover:before:scale-100 ${
      props.disabled
        ? "opacity-50 before:bg-transparent hover:before:bg-transparent"
        : ""
    }`;

    const position = props.absolute === true ? "absolute" : "relative";

    if (props.href) {
      return (
        <Tooltip label={props.label}>
          <Link
            href={props.href}
            className={clsx(
              baseStyles,
              variantClass,
              sizeClass,
              props.className,
              position
            )}
          >
            {props.children}
          </Link>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip label={props.label}>
          <button
            onClick={props.onClick}
            type={props.type}
            aria-label={props.label}
            className={clsx(
              baseStyles,
              variantClass,
              sizeClass,
              props.className,
              position
            )}
            ref={ref}
            {...props}
          >
            {props.children}
          </button>
        </Tooltip>
      );
    }
  }
);

export default function Button({
  variant,
  size,
  href,
  children,
  className,
  absolute,
  type,
  as,
  ...rest
}: ButtonProps) {
  let variantClass;
  let sizeClass;

  switch (variant) {
    case "secondary":
      variantClass =
        "text-yellow-1050 bg-yellow-1050/10 hover:before:bg-yellow-1050/20 dark:text-yellow-50 dark:bg-yellow-50/10 dark:hover:before:bg-yellow-50/20";
      break;
    case "tertiary":
      variantClass =
        "text-yellow-1050/90 border border-yellow-1050/20 hover:text-yellow-1050 hover:before:bg-yellow-1050/10 hover:border-yellow-1050/6030 dark:text-yellow-50/60 dark:border-yellow-50/20 dark:hover:text-yellow-50 dark:hover:before:bg-yellow-50/10 dark:hover:border-yellow-50/30";
      break;
    case "text":
      variantClass =
        "text-yellow-1050/90 hover:text-yellow-1050 hover:before:bg-yellow-1050/10 dark:text-yellow-50/60 dark:hover:text-yellow-50 dark:hover:before:bg-yellow-50/10";
      break;
    default:
      variantClass =
        "text-yellow-50 bg-yellow-1050 hover:before:bg-yellow-50/20 dark:text-yellow-1050 dark:bg-yellow-50 dark:hover:before:bg-yellow-1050/20";
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

  const { disabled } = { ...rest };

  const baseStyles = `overflow-hidden font-medium transition-colors duration-300 rounded-[3px] flex items-center justify-center before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-[3px] before:scale-75 hover:before:scale-100 ${
    disabled
      ? "opacity-50 before:bg-transparent hover:before:bg-transparent"
      : ""
  }`;

  const position = absolute === true ? "absolute" : "relative";

  const Tag = as!;

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, variantClass, sizeClass, className, position)}
      >
        {children}
      </Link>
    );
  } else if (as) {
    return (
      <Tag
        className={clsx(
          baseStyles,
          variantClass,
          sizeClass,
          className,
          position
        )}
      >
        {children}
      </Tag>
    );
  } else {
    return (
      <button
        type={type}
        className={clsx(
          baseStyles,
          variantClass,
          sizeClass,
          className,
          position
        )}
      >
        {children}
      </button>
    );
  }
}
