"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { IconButton } from "@/app/components/ui/button";
import { Text } from "./text";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "../utils/cn";
import { Label } from "@/app/components/ui/label";

interface TextInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "trailing"
  > {
  id: string;
  label?: string;
  type?: string;
  error?: string;
  hiddenLabel?: boolean;
  trailing?: React.ReactNode;
}

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
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {hiddenLabel ? (
        <VisuallyHidden.Root>
          <Label htmlFor={id}>{label}</Label>
        </VisuallyHidden.Root>
      ) : (
        label && (
          <Label htmlFor={id}>
            <Text>{label}</Text>
          </Label>
        )
      )}
      <div className="relative">
        <input
          id={id}
          value={value}
          type={type ?? "text"}
          placeholder={placeholder}
          onChange={onChange}
          data-1p-ignore
          className={cn(
            "w-full h-10 px-4 py-2.5 border-2 bg-neutral-900/[0.05] dark:bg-white/[0.05] flex text-base sm:text-sm rounded-full font-medium text-neutral-900 dark:text-white outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]",
            error ? "border-red-600 dark:border-red-400" : "border-transparent",
            className
          )}
          {...rest}
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

interface PasswordInputProps extends Omit<TextInputProps, "type" | "trailing"> {
  show: boolean;
  setShow: (show: boolean) => void;
}

export function PasswordInput({ id, show, setShow, ...rest }: PasswordInputProps) {
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
          {show ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
        </IconButton>
      }
      {...rest}
    />
  );
}
