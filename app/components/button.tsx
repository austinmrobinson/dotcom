"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "../utils/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] relative overflow-hidden rounded-full before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-full before:scale-75 hover:before:scale-100",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-neutral-900 hover:before:bg-white/20 dark:text-neutral-900 dark:bg-white dark:hover:before:bg-neutral-900/20",
        secondary:
          "text-neutral-900 bg-neutral-900/10 hover:before:bg-neutral-900/20 dark:text-white dark:bg-white/10 dark:hover:before:bg-white/20",
        tertiary:
          "text-neutral-700 border border-neutral-900/20 hover:text-neutral-900 hover:before:bg-neutral-900/10 hover:border-neutral-900/30 dark:text-neutral-300 dark:border-white/20 dark:hover:text-white dark:hover:before:bg-white/10 dark:hover:border-white/30",
        text: "text-neutral-700 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-300 dark:hover:text-white dark:hover:before:bg-white/10",
        // shadcn variants mapped
        default:
          "text-white bg-neutral-900 hover:before:bg-white/20 dark:text-neutral-900 dark:bg-white dark:hover:before:bg-neutral-900/20",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60",
        outline:
          "text-neutral-700 border border-neutral-900/20 hover:text-neutral-900 hover:before:bg-neutral-900/10 hover:border-neutral-900/30 dark:text-neutral-300 dark:border-white/20 dark:hover:text-white dark:hover:before:bg-white/10 dark:hover:border-white/30",
        ghost:
          "text-neutral-700 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-300 dark:hover:text-white dark:hover:before:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline before:hidden",
      },
      size: {
        large: "h-10 px-5 text-sm",
        medium: "h-8 px-4 text-sm",
        small: "h-7 px-3 text-xs",
        // shadcn sizes mapped
        default: "h-9 px-4 text-sm",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-6 text-sm",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  asChild?: boolean;
  absolute?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      asChild = false,
      absolute,
      as,
      children,
      ...props
    },
    ref
  ) => {
    const position = absolute === true ? "absolute" : "relative";

    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }), position)}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
          </span>
        </Link>
      );
    }

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }), position)}
          ref={ref as any}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    if (as) {
      const Tag = as as keyof JSX.IntrinsicElements;
      return (
        <Tag
          className={cn(buttonVariants({ variant, size, className }), position)}
          {...(props as any)}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
          </span>
        </Tag>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), position)}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";

// Icon button sizes
const iconButtonSizes = {
  large: "h-10 w-10",
  medium: "h-8 w-8",
  small: "h-7 w-7",
};

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  label: string;
  size?: "large" | "medium" | "small";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "primary", size = "large", label, href, children, ...props },
    ref
  ) => {
    const sizeClass = iconButtonSizes[size];

    const baseStyles = cn(
      "cursor-pointer overflow-hidden font-medium transition-colors duration-300 rounded-full flex items-center justify-center before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-full before:scale-75 hover:before:scale-100",
      props.disabled
        ? "opacity-50 before:bg-transparent hover:before:bg-transparent"
        : ""
    );

    let variantClass;
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

    const position = props.absolute === true ? "absolute" : "relative";

    const buttonContent = (
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    );

    if (href) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(baseStyles, variantClass, sizeClass, className, position)}
            >
              {buttonContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type={props.type}
            aria-label={label}
            className={cn(baseStyles, variantClass, sizeClass, className, position)}
            ref={ref}
            {...props}
          >
            {buttonContent}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }
);
IconButton.displayName = "IconButton";

export default Button;
export { buttonVariants };
