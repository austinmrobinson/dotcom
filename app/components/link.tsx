interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AustinLink({ href, children, className }: LinkProps) {
  return (
    <a
      href={href}
      className="relative font-medium text-neutral-800 hover:text-neutral-900 hover:before:bg-neutral-900/10 dark:text-neutral-200 dark:hover:text-white dark:hover:before:bg-white/10
        before:absolute before:-inset-x-1 before:-inset-y-[1px] before:transition-all before:duration-300 before:rounded"
      target="_blank"
    >
      {children}
    </a>
  );
}
