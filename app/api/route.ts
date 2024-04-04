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
    return { message: "Failed to fetch cookies or validate password" };
  }

  if (process.env.PAGE_PASSWORD !== password) {
    return new Response("incorrect password", {
      status: 401,
    });
  }

  return new Response("password correct", {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
