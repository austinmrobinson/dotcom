import { getRunRacePrep } from "@/app/features/run/lib/run-service";

export async function GET(
  _request: Request,
  context: { params: { raceId: string } }
) {
  const { raceId } = context.params;

  try {
    const data = await getRunRacePrep(raceId);

    if (!data) {
      return Response.json(
        { success: false, error: "Race not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Run race prep error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch race prep",
      },
      { status: 500 }
    );
  }
}
