import { serialize } from "cookie";
import { verifyPasswordAgainstStored } from "../utils/password";
import { checkRateLimit, getClientIP } from "../utils/rateLimit";
import { AUTH_COOKIE_NAME } from "../utils/constants";

export async function POST(request: Request) {
  const clientIP = getClientIP(request);

  // Check rate limit first
  const rateLimitResult = await checkRateLimit(clientIP);

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil(
      (rateLimitResult.resetAt - Date.now()) / 1000
    );
    return new Response(
      JSON.stringify({
        error: "Too many attempts. Please try again later.",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
        },
      }
    );
  }

  let password: string;

  try {
    const data: { password: string } = await request.json();
    password = data.password;

    if (!password || typeof password !== "string") {
      return new Response(JSON.stringify({ error: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const isValid = await verifyPasswordAgainstStored(password);

    if (isValid) {
      const cookie = serialize(AUTH_COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      });
    } else {
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
