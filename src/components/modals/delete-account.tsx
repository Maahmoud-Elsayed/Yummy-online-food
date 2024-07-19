import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

type DeleteModalProps = {
  provider: string;
};
const DeleteAccount = ({ provider }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("pages.myAccount");
  const { mutate, isPending } = api.auth.deleteAccount.useMutation({
    onSuccess: () => {
      signOut();
      setOpen(false);
    },
    onError: (error) => {
      setError(error.message ?? "Something went wrong");
    },
  });

  const deleteHandler = () => {
    setError(null);
    if (provider === "credentials") {
      if (passwordRef.current?.value.trim() === "") {
        setError("Password is required");
        return;
      }
      mutate(passwordRef.current?.value);
    } else {
      mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          type="button"
          className="w-full sm:w-auto"
        >
          {t("deleteAccount")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="rtl:text-right">
            {t("deleteAccount")}
          </DialogTitle>
          <DialogDescription className="rtl:text-right">
            {provider === "credentials" ? t("credentialsMsg") : t("oauthMsg")}
          </DialogDescription>
        </DialogHeader>
        {provider === "credentials" && (
          <div className="space-y-2 ">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
        <DialogFooter className="gap-2 rtl:gap-4 rtl:space-x-0">
          <Button
            disabled={isPending}
            type="button"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={isPending}
            type="button"
            variant="destructive"
            onClick={deleteHandler}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccount;
