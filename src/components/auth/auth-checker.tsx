"use client";

import { api } from "@/trpc/react";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const AuthChecker = () => {
  const { data: session, status, update } = useSession();
  const { data: user, isSuccess } = api.auth.authChecker.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (status === "authenticated" && isSuccess) {
      if (!user) {
        signOut({ callbackUrl: "/" });
      } else {
        if (user.status === "SUSPENDED") {
          signOut({
            callbackUrl:
              user && user.status === "SUSPENDED"
                ? "/suspended?u=" + user.id
                : "/",
          });
        } else if (
          user?.email !== session?.user?.email ||
          user?.status === session?.user?.status ||
          user?.role !== session?.user?.role ||
          user.name !== session?.user?.name ||
          user.image !== session?.user?.image
        ) {
          const { id, ...rest } = user;
          update({ ...session, user: { ...session?.user, ...rest } });
        } else {
          return;
        }
      }
    }
  }, [isSuccess]);

  return null;
};

export default AuthChecker;
