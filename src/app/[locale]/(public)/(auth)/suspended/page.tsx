import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/server/db";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { FaBan } from "react-icons/fa";

import { getTranslations } from "next-intl/server";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Account Suspended",
      description: "Your account has been suspended.",
    },
    ar: {
      title: "الحساب معطل",
      description: "تم تعطيل حسابك.",
    },
  };

  return data[locale] ?? data.en;
}

type SuspendedProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};
export default async function AccessSuspended({
  searchParams,
}: SuspendedProps) {
  const userId = searchParams?.u;
  if (!userId) {
    return notFound();
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId as string },
      select: { status: true },
    });
    if (!user || user.status === "ACTIVE") {
      return notFound();
    }
  } catch (error) {
    return notFound();
  }
  const t = await getTranslations("pages.suspended");

  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-gray-100">
      <Card className="-mt-[64px] space-y-4 rounded-lg bg-white p-8 text-center shadow-lg">
        <FaBan className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-semibold text-destructive">
          {t("title")}
        </h1>
        <p className="max-w-prose  text-muted-foreground">{t("description")}</p>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("goToHome")}
        </Link>
      </Card>
    </div>
  );
}
