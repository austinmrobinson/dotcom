import Link from "next/link";
import TopOfPage from "@/app/components/topOfPage";
import { Text } from "@/app/components/text";

export default function RunRaceNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <TopOfPage back="/run/races" title="Race not found">
        <Text>This race is not in your bib wall.</Text>
      </TopOfPage>
      <Link
        href="/run/races"
        className="text-foreground/80 hover:text-foreground underline-offset-4 hover:underline w-fit"
      >
        Back to races
      </Link>
    </div>
  );
}
