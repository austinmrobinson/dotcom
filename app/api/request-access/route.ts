import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const REASON_LABELS: Record<string, string> = {
  hiring: "Hiring / Recruitment",
  collaboration: "Project Collaboration",
  freelance: "Freelance Opportunity",
  networking: "Networking / Connect",
  other: "Other",
};

export async function POST(request: Request) {
  try {
    const { email, reason } = await request.json();

    // Server-side validation
    if (!email || !reason) {
      return Response.json(
        { error: "Email and reason are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate reason is one of the allowed values
    if (!REASON_LABELS[reason]) {
      return Response.json({ error: "Invalid reason" }, { status: 400 });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "austinrobinsondesign@gmail.com",
      replyTo: email,
      subject: `Portfolio Access Request: ${REASON_LABELS[reason]}`,
      html: `
        <h2>New Portfolio Access Request</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${REASON_LABELS[reason]}</p>
        <hr />
        <p>Reply directly to this email to respond to the requester.</p>
      `,
      text: `
New Portfolio Access Request

From: ${email}
Reason: ${REASON_LABELS[reason]}

Reply directly to this email to respond to the requester.
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Request access error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
