"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import LoginForm from "../auth/login-form";
import { Dialog, DialogContent } from "../ui/dialog";

type LoginFormModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoginFormModal = ({ open, setOpen }: LoginFormModalProps) => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      setOpen(false);
    }
  }, [session]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg overflow-auto">
        <div className=" py-4">
          <LoginForm isModal={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginFormModal;
