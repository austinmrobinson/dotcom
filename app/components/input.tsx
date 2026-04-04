"use client";

import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { Text } from "./text";
import { cn } from "../utils/cn";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/app/components/ui/input-group";

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
  if (trailing) {
    return (
      <div className="flex flex-col gap-1">
        {hiddenLabel ? (
          <Label htmlFor={id} className="sr-only">{label}</Label>
        ) : (
          label && (
            <Label htmlFor={id}>
              <Text>{label}</Text>
            </Label>
          )
        )}
        <InputGroup className={cn(error && "border-destructive")} aria-invalid={!!error || undefined}>
          <InputGroupInput
            id={id}
            value={value}
            type={type ?? "text"}
            placeholder={placeholder}
            onChange={onChange}
            data-1p-ignore
            className={className}
            {...rest}
          />
          <InputGroupAddon align="inline-end">
            {trailing}
          </InputGroupAddon>
        </InputGroup>
        {error && (
          <Text
            weight="medium"
            size="caption"
            className="text-destructive mb-2"
          >
            {error}
          </Text>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {hiddenLabel ? (
        <Label htmlFor={id} className="sr-only">{label}</Label>
      ) : (
        label && (
          <Label htmlFor={id}>
            <Text>{label}</Text>
          </Label>
        )
      )}
      <Input
        id={id}
        value={value}
        type={type ?? "text"}
        placeholder={placeholder}
        onChange={onChange}
        data-1p-ignore
        aria-invalid={!!error || undefined}
        className={className}
        {...rest}
      />
      {error && (
        <Text
          weight="medium"
          size="caption"
          className="text-destructive mb-2"
        >
          {error}
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
        <InputGroupButton
          variant="ghost"
          size="icon-sm"
          aria-label={show ? "Hide Password" : "Show Password"}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          {show ? <RiEyeOffLine /> : <RiEyeLine />}
        </InputGroupButton>
      }
      {...rest}
    />
  );
}
