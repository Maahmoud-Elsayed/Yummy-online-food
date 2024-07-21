import LoginForm from "@/components/auth/login-form";
import Container from "@/components/ui/container";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Login",
      description:
        "Log in to your account to start ordering your favorite food.",
    },
    ar: {
      title: "تسجيل الدخول",
      description: "سجل الدخول إلى حسابك لبدء طلب طعامك المفضل.",
    },
  };

  return data[locale] ?? data.en;
}

const Login = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  return (
    <Container className=" relative my-10 flex items-center justify-center   ">
      <div className="flex w-full max-w-md overflow-hidden rounded-lg p-5 shadow-xl  lg:p-0">
        <LoginForm />
      </div>
    </Container>
  );
};

export default Login;
