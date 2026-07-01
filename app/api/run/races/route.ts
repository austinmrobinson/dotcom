import { listRunRaces } from "@/app/features/run/lib/run-service";

export async function GET() {
  try {
    const data = await listRunRaces();
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Run races error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch races",
      },
      { status: 500 }
    );
  }
}
