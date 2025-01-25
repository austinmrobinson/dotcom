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
        className="relative font-medium text-yellow-1050/90 hover:text-yellow-1050 hover:before:bg-yellow-1050/10 dark:text-neutral-200 dark:hover:text-yellow-50 dark:hover:before:bg-yellow-50/10
        before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded"
        target="_blank"
      >
        {children}
      </a>
    );
  } else {
    return (
      <button
        className="relative font-medium text-yellow-1050/90 hover:text-yellow-1050 hover:before:bg-yellow-1050/10 dark:text-neutral-200 dark:hover:text-yellow-50 dark:hover:before:bg-yellow-50/10
        before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded"
      >
        {children}
      </button>
    );
  }
}
