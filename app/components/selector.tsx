import clsx from "clsx";

interface SelectorProps {
  name: string;
  label: string;
  size?: string;
}

export function Selector({ name, label, size }: SelectorProps) {
  switch (size) {
    case "small":
      size = "h-7 px-3";
    default:
      size = "h-8 px-4";
  }

  const baseStyles =
    "selector flex cursor-pointer relative items-center justify-center overflow-hidden rounded-[3px] text-yellow-1050 bg-yellow-1050/10 hover:before:bg-yellow-1050/20 dark:text-yellow-50 dark:bg-yellow-50/10 dark:hover:before:bg-yellow-50/20 text-center font-medium transition-colors duration-300 before:absolute before:inset-0 before:scale-75 before:rounded-[3px] before:transition-all before:duration-300 hover:before:scale-100 hover:before:bg-yellow-1050/10 dark:hover:before:bg-yellow-50/10";

  return (
    <div className="flex shrink-0">
      <input
        type="radio"
        id={name}
        value={name}
        className="selector-input m-0 hidden h-0 w-0 appearance-none"
      />
      <label htmlFor={name} className={clsx(baseStyles, size)}>
        {label}
      </label>
    </div>
  );
}

interface SelectorGroupProps {
  name: string;
  items: SelectorProps[];
  size?: string;
  className?: string;
}

export function SelectorGroup({
  name,
  items,
  size,
  className,
}: SelectorGroupProps) {
  return (
    <fieldset
      name={name}
      className={clsx(
        "flex grow gap-3 overflow-x-scroll sm:overflow-visible",
        className
      )}
    >
      {items.map((item: any, index: any) => (
        <Selector key={index} label={item.label} name={item.name} size={size} />
      ))}
    </fieldset>
  );
}
