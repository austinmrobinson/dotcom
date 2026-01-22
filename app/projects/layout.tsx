import { cookies } from "next/headers";
import PasswordForm from "../components/passwordForm";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const loginCookie = cookiesStore.get(process.env.PASSWORD_COOKIE_NAME!);
  const isLoggedIn = !!loginCookie?.value;

  if (!isLoggedIn) {
    return <PasswordForm />;
  }

  return children;
}
