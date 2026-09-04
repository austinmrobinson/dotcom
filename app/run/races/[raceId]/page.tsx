import { notFound } from "next/navigation";
import { getRunRacePrep } from "@/app/features/run/lib/run-service";
import { RacePrepView } from "@/app/features/run/components/RacePrepView";

interface RaceDetailPageProps {
  params: { raceId: string };
}

export async function generateMetadata({ params }: RaceDetailPageProps) {
  const data = await getRunRacePrep(params.raceId);

  if (!data) {
    return { title: "Race not found" };
  }

  return {
    title: data.race.name,
    description: `${data.race.distanceLabel} on ${data.race.date}`,
  };
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const data = await getRunRacePrep(params.raceId);

  if (!data) {
    notFound();
  }

  return <RacePrepView data={data} />;
}
