import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

type SocialLoginProps = {
  isSubmitting?: boolean;
  isModal?: boolean;
  callbackUrl?: string | null;
};

const SocialLogin = ({
  isSubmitting,
  isModal,
  callbackUrl,
}: SocialLoginProps) => {
  const t = useTranslations("pages.login");
  const googleSignInHandler = async () => {
    if (isModal) {
      await signIn("google");
    } else {
      await signIn("google", {
        redirect: true,
        callbackUrl: callbackUrl ?? "/",
      });
    }
  };

  const gitHubSignInHandler = async () => {
    if (isModal) {
      await signIn("github");
    } else {
      await signIn("github", {
        redirect: true,
        callbackUrl: callbackUrl ?? "/",
      });
    }
  };

  return (
    <>
      <div className="relative my-8">
        <span className="block h-px w-full bg-gray-400"></span>
        <p className="absolute inset-x-0 -top-3 mx-auto inline-block w-fit bg-white px-2 text-sm">
          {t("or")}
        </p>
      </div>
      <div className="space-y-4 text-sm font-medium">
        <Button
          className="flex w-full items-center gap-3"
          variant="outline"
          onClick={googleSignInHandler}
          disabled={isSubmitting}
        >
          <FcGoogle className="h-5 w-5" />
          <span className="rtl:pt-0.5">{t("google")}</span>
        </Button>
        <Button
          className="flex w-full items-center gap-3"
          variant="outline"
          onClick={gitHubSignInHandler}
          disabled={isSubmitting}
        >
          <FaGithub className="h-5 w-5 text-gray-900" />
          <span className="rtl:pt-0.5">{t("gitHub")}</span>
        </Button>
      </div>
    </>
  );
};

export default SocialLogin;
