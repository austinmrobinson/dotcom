import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.STRAVA_CLIENT_ID;

  if (!clientId) {
    return new Response(
      `
      <html>
        <head><title>Strava Setup</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1>Strava API Setup Required</h1>
          <p>You need to set up a Strava API application first:</p>
          <ol>
            <li>Go to <a href="https://www.strava.com/settings/api" target="_blank">https://www.strava.com/settings/api</a></li>
            <li>Create a new application (or use existing)</li>
            <li>Set the "Authorization Callback Domain" to <code>localhost</code></li>
            <li>Copy your Client ID and Client Secret</li>
            <li>Add them to your <code>.env.local</code>:
              <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret</pre>
            </li>
            <li>Restart your dev server and visit this page again</li>
          </ol>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/strava/callback`;

  const authUrl = new URL("https://www.strava.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "activity:read_all");

  return NextResponse.redirect(authUrl.toString());
}
