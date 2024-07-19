import ChangePasswordForm from "@/components/auth/change-password-form";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { buttonVariants } from "@/components/ui/button";
import { redirect } from "@/navigation";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type ResetPasswordPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Reset Password",
      description: "Reset your password",
    },
    ar: {
      title: "اعادة تعيين كلمة المرور",
      description: "اعادة تعيين كلمة المرور",
    },
  };

  return data[locale] ?? data.en;
}

const ResetPassword = async ({ searchParams }: ResetPasswordPageProps) => {
  const token = searchParams?.token;
  const session = await getServerAuthSession();
  if (session && !token) {
    redirect("/");
  }
  let content = <ResetPasswordForm />;
  const t = await getTranslations("pages.resetPassword");

  if (token) {
    try {
      await api.auth.getPasswordResetToken(token as string);
      content = (
        <ChangePasswordForm resetPasswordToken={searchParams.token as string} />
      );
    } catch (error) {
      content = (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-semibold text-red-600">
              {t("expired")}
            </h1>
            <p className="mb-6 text-gray-700">{t("expiredMsg")}</p>
            <Link
              href={{
                pathname: "/reset-password",
                query: { token: undefined },
              }}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
              })}
            >
              {t("request")}
            </Link>
          </div>
        </div>
      );
    }
  }
  return content;
};

export default ResetPassword;
