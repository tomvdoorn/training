import { useSession } from "next-auth/react";

export function useAuthSession() {
  const { data: session } = useSession();
  return session;
};
