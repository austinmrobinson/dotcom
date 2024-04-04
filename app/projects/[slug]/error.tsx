"use client";

import Animate from "@/app/components/animate";
import Button from "@/app/components/button";
import { Heading } from "@/app/components/text";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Animate className="flex flex-col gap-12 items-center text-center">
      <Heading size="h2" as="h1">
        Something went wrong
      </Heading>
      <Button
        variant="secondary"
        onClick={
          // Attempt to recover by trying to re-render the route
          () => reset()
        }
      >
        Try Again
      </Button>
    </Animate>
  );
}
