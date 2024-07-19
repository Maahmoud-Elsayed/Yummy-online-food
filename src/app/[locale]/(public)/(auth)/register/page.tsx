import RegisterForm from "@/components/auth/register-form";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Register",
      description: "Create an account to start ordering your favorite food.",
    },
    ar: {
      title: "تسجيل الدخول",
      description: "أنشئ حسابًا لتبدأ في طلب طعامك المفضل.",
    },
  };

  return data[locale] ?? data.en;
}

const Register = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  return <RegisterForm />;
};

export default Register;
