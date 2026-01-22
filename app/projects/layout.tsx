import { cookies } from "next/headers";
import PasswordForm from "../components/passwordForm";
import { AUTH_COOKIE_NAME } from "../utils/constants";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const loginCookie = cookiesStore.get(AUTH_COOKIE_NAME);
  const isLoggedIn = !!loginCookie?.value;

  if (!isLoggedIn) {
    return <PasswordForm />;
  }

  return children;
}
