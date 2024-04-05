import { Eye, EyeOff } from "react-feather";
import { IconButton } from "./button";
import { Text } from "./text";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";

export default function TextInput({
  id,
  label,
  placeholder,
  value,
  type,
  onChange,
  className,
  error,
  hiddenLabel,
  trailing,
  ...rest
}: HTMLInputElement | any) {
  return (
    <div className="flex flex-col gap-1">
      {hiddenLabel ? (
        <VisuallyHidden.Root>
          <label htmlFor={id}>{label}</label>
        </VisuallyHidden.Root>
      ) : (
        <label htmlFor={id}>
          <Text>{label}</Text>
        </label>
      )}
      <div className="relative">
        <input
          value={value}
          type={type ?? "text"}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full h-10 px-4 py-2.5 border-2 bg-neutral-900/[0.05] dark:bg-white/[0.05] flex text-base sm:text-sm rounded-full font-medium text-neutral-900 dark:text-white ${
            error ? "border-red-600 dark:border-red-400" : "border-transparent"
          } ${className}`}
          data-1p-ignore
        />
        {trailing && <div className="absolute right-1 top-1">{trailing}</div>}
      </div>
      {error && (
        <Text
          weight="medium"
          size="caption"
          className="text-red-600 dark:text-red-400 mb-2"
        >
          {error ?? "Invalid. Enter correct value"}
        </Text>
      )}
    </div>
  );
}

export function PasswordInput(props: any) {
  const { id, show, setShow, ...rest } = props;

  return (
    <TextInput
      id={id}
      type={show ? "text" : "password"}
      trailing={
        <IconButton
          variant="text"
          size="medium"
          type="button"
          label={show ? "Hide Password" : "Show Password"}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          {show ? <EyeOff size="16" /> : <Eye size="16" />}
        </IconButton>
      }
      {...rest}
    />
  );
}
