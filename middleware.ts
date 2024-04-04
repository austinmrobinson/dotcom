import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  let password;
  let hasCookie;

  try {
    password = request.nextUrl.searchParams.get(process.env.SEARCH_QUERY_NAME!);
    hasCookie = request.cookies.has(process.env.PASSWORD_COOKIE_NAME!);
  } catch (error) {
    console.error(error);
  }
  const url = request.nextUrl.clone();
  const response = NextResponse.redirect(url);

  if (password === process.env.PAGE_PASSWORD && !hasCookie) {
    try {
      response.cookies.set(`${process.env.PASSWORD_COOKIE_NAME}`, "true");
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
