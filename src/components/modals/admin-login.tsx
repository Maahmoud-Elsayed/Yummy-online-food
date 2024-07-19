"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ErrorTemplate from "../ui/error-template";
import LoadingButton from "../ui/loading-button";
import { useTranslations } from "next-intl";
import { env } from "@/env";
const AdminLogin = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const t = useTranslations("pages.home.modals.admin");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "unauthenticated") {
      timer = setTimeout(() => {
        setOpen(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  const loginHandler = async () => {
    setError("");
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: "admin@yummy.com",
      password: env.NEXT_PUBLIC_ADMIN_PASSWORD,
      callbackUrl: "/dashboard",
    });
    if (response?.error) {
      setLoading(false);
      setError(response?.error);
    } else {
      setLoading(false);
      setOpen(false);
      router.push(response?.url ?? "/");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div>{error && <ErrorTemplate>{error}</ErrorTemplate>}</div>
        <DialogFooter className="flex  items-center justify-end gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {t("close")}
            </Button>
          </DialogClose>
          <LoadingButton
            disabled={loading}
            isLoading={loading}
            type="button"
            variant="default"
            onClick={loginHandler}
            className="w-full sm:w-auto"
          >
            {t("login")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
