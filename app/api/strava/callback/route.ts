export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new Response(
      `
      <html>
        <head><title>Strava Authorization Failed</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1>Authorization Failed</h1>
          <p>Error: ${error}</p>
          <p><a href="/api/strava/auth">Try again</a></p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new Response(
      `
      <html>
        <head><title>Missing Code</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1>Missing Authorization Code</h1>
          <p>No authorization code received from Strava.</p>
          <p><a href="/api/strava/auth">Start over</a></p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      `
      <html>
        <head><title>Configuration Error</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1>Configuration Error</h1>
          <p>Missing STRAVA_CLIENT_ID or STRAVA_CLIENT_SECRET in environment variables.</p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(
      `
      <html>
        <head><title>Strava Connected!</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Strava Connected Successfully!</h1>
          <p>Add the following to your <code>.env.local</code> file:</p>
          <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 14px;">
STRAVA_CLIENT_ID=${clientId}
STRAVA_CLIENT_SECRET=${clientSecret}
STRAVA_REFRESH_TOKEN=${data.refresh_token}</pre>
          <p style="margin-top: 24px;"><strong>Athlete Info:</strong></p>
          <ul>
            <li>Athlete ID: ${data.athlete?.id}</li>
            <li>Name: ${data.athlete?.firstname} ${data.athlete?.lastname}</li>
          </ul>
          <p style="color: #666; margin-top: 24px;">
            After adding these to <code>.env.local</code>, restart your dev server.
            The refresh token will be used to automatically obtain new access tokens.
          </p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    return new Response(
      `
      <html>
        <head><title>Error</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Token Exchange Failed</h1>
          <p>${error instanceof Error ? error.message : "Unknown error"}</p>
          <p><a href="/api/strava/auth">Try again</a></p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
