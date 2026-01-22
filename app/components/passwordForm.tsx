"use client";

import React, { useState } from "react";
import TextInput, { PasswordInput } from "./input";
import { Button } from "@/app/components/ui/button";
import { Heading, Text } from "./text";
import { IconLock } from "@tabler/icons-react";
import Animate from "./animate";
import Copy from "./copy";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordIncorrect, setPasswordIncorrect] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setShow(false);
    setPasswordIncorrect("");
    setRateLimited(false);

    try {
      const response = await fetch(`/api`, {
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await response.json();

      if (response.status === 429) {
        setRateLimited(true);
        setRetryAfter(data.retryAfter || 60);
        setLoading(false);
        return;
      }

      if (response.status !== 200) {
        setPasswordIncorrect(data.error || "Password incorrect");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch (error) {
      setPasswordIncorrect("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Animate className="flex flex-col justify-center gap-10 w-full max-w-[364px] sm:max-w-[264px] grow mx-auto mb-32">
      <div className="flex flex-col gap-5 items-center text-center">
        <div className="p-3 w-12 h-12 rounded-full bg-neutral-900/10 dark:bg-white/10">
          <IconLock size={24} stroke={1.5} />
        </div>
        <div className="flex flex-col gap-1">
          <Heading size="h3" as="h1">
            Content Locked
          </Heading>
          <Text>Request access to view</Text>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordInput
          id="password"
          label="Password"
          hiddenLabel
          show={show}
          setShow={setShow}
          value={password}
          placeholder="Enter Password"
          error={rateLimited ? "" : passwordIncorrect}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        {rateLimited && (
          <Text className="text-amber-600 dark:text-amber-400 text-sm">
            Too many attempts. Please try again in{" "}
            {Math.ceil(retryAfter / 60)} minute
            {Math.ceil(retryAfter / 60) !== 1 ? "s" : ""}.
          </Text>
        )}
        <Button type="submit" disabled={loading || rateLimited}>
          {loading ? "Checking..." : "Submit"}
        </Button>
      </form>
      <div className="flex justify-center">
        <Copy text="austinrobinsondesign@gmail.com" type="Email">
          <Button as="div" variant="text">
            Request Access
          </Button>
        </Copy>
      </div>
    </Animate>
  );
}
