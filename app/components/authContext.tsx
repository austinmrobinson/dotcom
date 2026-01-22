import { cookies } from "next/headers";
import PasswordForm from "./passwordForm";
import { AUTH_COOKIE_NAME } from "../utils/constants";

interface AuthContextProps {
  children: React.ReactNode;
}

export default async function AuthContext({ children }: AuthContextProps) {
  const cookiesStore = await cookies();
  const loginCookies = cookiesStore.get(AUTH_COOKIE_NAME);
  const isLoggedIn = !!loginCookies?.value;

  if (!isLoggedIn) {
    return <PasswordForm />;
  }

  return <>{children}</>;
}
