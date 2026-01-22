"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import TextInput from "./input";
import { Heading, Text } from "./text";
import { IconCheck, IconLoader2, IconAlertCircle } from "@tabler/icons-react";

type FormStatus = "idle" | "loading" | "success" | "error";

const REASON_OPTIONS = [
  { value: "hiring", label: "Hiring / Recruitment" },
  { value: "collaboration", label: "Project Collaboration" },
  { value: "freelance", label: "Freelance Opportunity" },
  { value: "networking", label: "Networking / Connect" },
  { value: "other", label: "Other" },
];

export default function RequestAccessDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [emailError, setEmailError] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm(): boolean {
    let valid = true;
    setEmailError("");
    setReasonError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    if (!reason) {
      setReasonError("Please select a reason");
      valid = false;
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to send request");
      }

      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  function resetForm() {
    setStatus("idle");
    setEmail("");
    setReason("");
    setEmailError("");
    setReasonError("");
    setErrorMessage("");
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button as="div" variant="text">
          Request Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <IconCheck
                className="text-green-600 dark:text-green-400"
                size={24}
                stroke={1.5}
              />
            </div>
            <div className="text-center">
              <Heading size="h4">Request Sent!</Heading>
              <Text className="mt-1">You&apos;ll hear back soon.</Text>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request Access</DialogTitle>
              <DialogDescription>
                Enter your email and reason to request access to locked content.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              <TextInput
                id="request-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                error={emailError}
                disabled={status === "loading"}
              />

              <div className="flex flex-col gap-1">
                <Label htmlFor="request-reason">
                  <Text>Reason</Text>
                </Label>
                <Select
                  value={reason}
                  onValueChange={setReason}
                  disabled={status === "loading"}
                >
                  <SelectTrigger
                    id="request-reason"
                    className={`w-full h-10 px-4 py-2.5 bg-neutral-900/[0.05] dark:bg-white/[0.05] rounded-full font-medium text-neutral-900 dark:text-white ${
                      reasonError
                        ? "border-2 border-red-600 dark:border-red-400"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 dark:bg-white border-none rounded-2xl overflow-hidden">
                    {REASON_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white dark:text-neutral-900 focus:bg-white/10 dark:focus:bg-neutral-900/10 focus:text-white dark:focus:text-neutral-900 rounded-xl"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reasonError && (
                  <Text
                    weight="medium"
                    size="caption"
                    className="text-red-600 dark:text-red-400"
                  >
                    {reasonError}
                  </Text>
                )}
              </div>

              {status === "error" && errorMessage && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <IconAlertCircle size={16} stroke={1.5} />
                  <Text size="caption" weight="medium">
                    {errorMessage}
                  </Text>
                </div>
              )}

              <Button type="submit" disabled={status === "loading"} className="mt-2">
                {status === "loading" ? (
                  <>
                    <IconLoader2 size={16} stroke={1.5} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
