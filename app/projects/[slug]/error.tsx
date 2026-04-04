"use client";

import Animate from "@/app/components/animate";
import { Button } from "@/app/components/ui/button";
import { Heading, Text } from "@/app/components/text";
import { useEffect } from "react";
import { RiErrorWarningLine } from "@remixicon/react";

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
    <Animate className="flex flex-col justify-center gap-10 w-full max-w-[264px] grow mx-auto mb-32">
      <div className="flex flex-col gap-5 items-center text-center">
        <div className="p-3 size-12 rounded-full bg-overlay-light">
          <RiErrorWarningLine size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <Heading size="h3" as="h1">
            Something went wrong
          </Heading>
          <Text>
            There was an error while trying to fetch the data. Reload to try
            again.
          </Text>
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={
          // Attempt to recover by trying to re-render the route
          () => reset()
        }
      >
        Reload
      </Button>
    </Animate>
  );
}
