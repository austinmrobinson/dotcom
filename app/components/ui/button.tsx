"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/app/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] relative overflow-hidden rounded-full before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-full before:scale-75 hover:before:scale-100",
  {
    variants: {
      variant: {
        primary:
          "text-primary-foreground bg-primary hover:before:bg-overlay-strong",
        secondary:
          "text-foreground bg-overlay-light hover:before:bg-overlay-strong",
        tertiary:
          "text-text-secondary border border-border-medium hover:text-foreground hover:before:bg-overlay-light hover:border-border-strong",
        text: "text-text-secondary hover:text-foreground hover:before:bg-overlay-light",
        destructive:
          "bg-destructive text-destructive-foreground hover:before:bg-black/10",
        link: "text-primary underline-offset-4 hover:underline before:hidden",
      },
      size: {
        large: "h-10 px-5 text-sm",
        medium: "h-8 px-4 text-sm",
        small: "h-7 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
  asChild?: boolean
  absolute?: boolean
  as?: keyof JSX.IntrinsicElements
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
    const position = absolute === true ? "absolute" : "relative"
    const classes = cn(buttonVariants({ variant, size, className }), position)

    const content = (
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    )

    if (href) {
      return (
        <Link href={href} className={classes} data-slot="button">
          {content}
        </Link>
      )
    }

    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref as React.Ref<HTMLElement>}
          data-slot="button"
          {...props}
        >
          {children}
        </Slot>
      )
    }

    if (as) {
      const Tag = as as keyof JSX.IntrinsicElements
      return (
        <Tag className={classes} data-slot="button" {...(props as object)}>
          {content}
        </Tag>
      )
    }

    return (
      <button className={classes} ref={ref} data-slot="button" {...props}>
        {content}
      </button>
    )
  }
)
Button.displayName = "Button"

// IconButton variants
const iconButtonVariants = cva(
  "cursor-pointer overflow-hidden font-medium transition-colors duration-300 rounded-full flex items-center justify-center before:absolute before:inset-0 before:transition-all before:duration-300 before:rounded-full before:scale-75 hover:before:scale-100 disabled:opacity-50 disabled:before:bg-transparent disabled:hover:before:bg-transparent",
  {
    variants: {
      variant: {
        primary:
          "text-primary-foreground bg-primary hover:before:bg-overlay-strong",
        secondary:
          "text-foreground bg-overlay-light hover:before:bg-overlay-strong",
        tertiary:
          "text-text-secondary border border-border-medium hover:text-foreground hover:before:bg-overlay-light hover:border-border-strong",
        text: "text-text-secondary hover:text-foreground hover:before:bg-overlay-light",
      },
      size: {
        large: "h-10 w-10",
        medium: "h-8 w-8",
        small: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  label: string
  href?: string
  absolute?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      label,
      href,
      absolute,
      children,
      ...props
    },
    ref
  ) => {
    const position = absolute === true ? "absolute" : "relative"
    const classes = cn(iconButtonVariants({ variant, size, className }), position)

    const content = (
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    )

    if (href) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href} className={classes} data-slot="icon-button">
              {content}
            </Link>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type={props.type}
            aria-label={label}
            className={classes}
            ref={ref}
            data-slot="icon-button"
            {...props}
          >
            {content}
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    )
  }
)
IconButton.displayName = "IconButton"

export { Button, IconButton, buttonVariants, iconButtonVariants }
export type { ButtonProps, IconButtonProps }
