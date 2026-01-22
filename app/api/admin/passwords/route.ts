import {
  addPassword,
  deletePassword,
  getStoredPasswords,
} from "../../../utils/password";
import { MIN_PASSWORD_LENGTH } from "../../../utils/constants";

function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace("Bearer ", "");
  return !!(process.env.ADMIN_API_KEY && apiKey === process.env.ADMIN_API_KEY);
}

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function kvNotConfigured() {
  return new Response(
    JSON.stringify({
      error: "Vercel KV not configured",
      help: "Add KV_REST_API_URL and KV_REST_API_TOKEN to your environment",
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

// GET - List all passwords (returns IDs and labels, not hashes)
export async function GET(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  try {
    const passwords = await getStoredPasswords();
    return new Response(
      JSON.stringify({
        passwords: passwords.map((p) => ({
          id: p.id,
          label: p.label,
          createdAt: new Date(p.createdAt).toISOString(),
        })),
        count: passwords.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not configured")) {
      return kvNotConfigured();
    }
    return new Response(JSON.stringify({ error: "Failed to list passwords" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST - Add a new password
export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  try {
    const { password, label } = await request.json();

    if (!password || typeof password !== "string") {
      return new Response(JSON.stringify({ error: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stored = await addPassword(password, label);

    return new Response(
      JSON.stringify({
        success: true,
        id: stored.id,
        label: stored.label,
        message: "Password added successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not configured")) {
      return kvNotConfigured();
    }
    return new Response(JSON.stringify({ error: "Failed to add password" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE - Remove a password by ID
export async function DELETE(request: Request) {
  if (!checkAuth(request)) return unauthorized();

  try {
    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return new Response(JSON.stringify({ error: "Password ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deleted = await deletePassword(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Password not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Password deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not configured")) {
      return kvNotConfigured();
    }
    return new Response(JSON.stringify({ error: "Failed to delete password" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
