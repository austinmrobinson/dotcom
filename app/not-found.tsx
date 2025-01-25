import Animate from "@/app/components/animate";
import Button from "@/app/components/button";
import { Heading, Text } from "@/app/components/text";
import { Frown } from "react-feather";
import AustinLink from "./components/link";
import Copy from "./components/copy";

export default function NotFound() {
  return (
    <Animate className="flex flex-col justify-center gap-10 w-full max-w-[264px] grow mx-auto mb-32">
      <div className="flex flex-col gap-5 items-center text-center">
        <div className="p-3 w-12 h-12 rounded-[3px] bg-yellow-1050/10 dark:bg-yellow-50/10">
          <Frown />
        </div>
        <div className="flex flex-col gap-1">
          <Heading size="h3" as="h1">
            Page Not Found
          </Heading>
          <Text>
            There is no content here. This is probably an error on my end.
            <br></br>
            <Copy text="austinrobinsondesign@gmail.com" type="Email">
              <AustinLink>Contact me</AustinLink>
            </Copy>{" "}
            if you need help!
          </Text>
        </div>
      </div>
      <Button variant="secondary" href="/">
        Back to Home
      </Button>
    </Animate>
  );
}
