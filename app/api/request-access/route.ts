import { Resend } from "resend";
import { checkRateLimit, getClientIP } from "../../utils/rateLimit";

const REASON_LABELS: Record<string, string> = {
  hiring: "Hiring / Recruitment",
  collaboration: "Project Collaboration",
  freelance: "Freelance Opportunity",
  networking: "Networking / Connect",
  other: "Other",
};

const REQUEST_ACCESS_RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const clientIP = getClientIP(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIP}:request-access`,
    REQUEST_ACCESS_RATE_LIMIT
  );

  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil(
      (rateLimitResult.resetAt - Date.now()) / 1000
    );
    return Response.json(
      { error: "Too many requests. Please try again later.", retryAfter },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const { email, reason } = await request.json();

    if (!email || !reason) {
      return Response.json(
        { error: "Email and reason are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!REASON_LABELS[reason]) {
      return Response.json({ error: "Invalid reason" }, { status: 400 });
    }

    const safeEmail = escapeHtml(email);
    const reasonLabel = REASON_LABELS[reason];

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return Response.json({ error: "Email service not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "austinrobinsondesign@gmail.com",
      replyTo: email,
      subject: `Portfolio Access Request: ${reasonLabel}`,
      html: `
        <h2>New Portfolio Access Request</h2>
        <p><strong>From:</strong> ${safeEmail}</p>
        <p><strong>Reason:</strong> ${reasonLabel}</p>
        <hr />
        <p>Reply directly to this email to respond to the requester.</p>
      `,
      text: `
New Portfolio Access Request

From: ${email}
Reason: ${reasonLabel}

Reply directly to this email to respond to the requester.
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json(
      { success: true, id: data?.id },
      {
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Request access error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
