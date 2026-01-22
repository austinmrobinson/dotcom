interface LinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AustinLink({ href, children, className }: LinkProps) {
  if (href) {
    return (
      <a
        href={href}
        className="relative font-medium text-foreground/80 hover:text-foreground hover:before:bg-overlay-light
        before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded"
        target="_blank"
      >
        {children}
      </a>
    );
  } else {
    return (
      <button
        className="relative font-medium text-foreground/80 hover:text-foreground hover:before:bg-overlay-light
        before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded"
      >
        {children}
      </button>
    );
  }
}
