"use client";

import React, { useState } from "react";
import TextInput, { PasswordInput } from "./input";
import Button from "./button";
import { Heading, Text } from "./text";
import { IconLock } from "@tabler/icons-react";
import Animate from "./animate";
import Copy from "./copy";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordIncorrect, setPasswordIncorrect] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setShow(false);

    const request = await fetch(`/api`, {
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
      method: "post",
    });

    if (request.status !== 200)
      return setPasswordIncorrect("Password incorrect"), setLoading(false);
    else window.location.reload();
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
          error={passwordIncorrect}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button type="submit">Submit</Button>
      </form>
      <Copy text="austinrobinsondesign@gmail.com" type="Email">
        <Button as="div" variant="text">
          Request Access
        </Button>
      </Copy>
    </Animate>
  );
}
