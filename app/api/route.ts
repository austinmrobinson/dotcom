import { serialize } from "cookie";

export async function POST(request: Request, params: { slug: string }) {
  let password;
  let cookie;

  try {
    const data: { password: string } = await request.json();
    password = data.password;
    cookie = serialize(process.env.PASSWORD_COOKIE_NAME!, "true", {
      httpOnly: true,
      path: "/",
    });
  } catch (error) {
    return new Response("Server error");
  }

  const passwords = JSON.parse(process.env.PAGE_PASSWORD);
  console.log(passwords);

  if (passwords.includes(password)) {
    return new Response("Password correct", {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } else {
    return new Response("Incorrect password", {
      status: 401,
    });
  }
}
