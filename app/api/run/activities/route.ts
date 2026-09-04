import { listRunActivities } from "@/app/features/run/lib/run-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;

  try {
    const data = await listRunActivities({ cursor, limit });
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Run activities error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch activities",
      },
      { status: 500 }
    );
  }
}
