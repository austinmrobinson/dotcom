import TopOfPage from "@/app/components/topOfPage";
import { Text } from "@/app/components/text";
import { listRunRaces } from "@/app/features/run/lib/run-service";
import { RaceBibWall } from "@/app/features/run/components/RaceBibWall";

export const metadata = {
  title: "Races",
};

export default async function RunRacesPage() {
  const races = await listRunRaces();

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <TopOfPage back="/run" title="Races">
        <Text className="text-pretty">
          A bib wall of races. Select a race to see the training block leading
          up to it.
        </Text>
      </TopOfPage>

      <RaceBibWall races={races} />
    </div>
  );
}
