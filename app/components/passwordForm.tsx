"use client";

import React, { useState } from "react";
import TextInput, { PasswordInput } from "./input";
import Button from "./button";
import { Heading } from "./text";
import { Lock } from "react-feather";

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
    <div className="flex flex-col gap-10 justify-stretch max-w-[264px] m-auto">
      <div className="flex flex-col gap-4 items-center">
        <div className="p-3 w-12 h-12 rounded-full bg-neutral-900/10 dark:bg-white/10">
          <Lock />
        </div>
        <Heading size="h3" as="h2">
          This Content is Locked
        </Heading>
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
    </div>
  );
}
