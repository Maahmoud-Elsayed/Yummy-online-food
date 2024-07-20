"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MotionDiv from "@/components/ui/motion-div";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function Error({
  // error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pages.error");
  return (
    <MotionDiv
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ ease: "easeIn", duration: 0.5 }}
      className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-gray-100 px-2.5"
    >
      <Card className="-mt-[64px] space-y-4 rounded-lg bg-white p-8 text-center shadow-lg">
        <h2 className=" text-xl font-semibold text-destructive">
          {t("title")}
        </h2>
        <p className="max-w-prose  text-muted-foreground">{t("description")}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" size="sm" onClick={() => reset()}>
            {t("tryAgain")}
          </Button>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {t("goToHome")}
          </Link>
        </div>
      </Card>
    </MotionDiv>
  );
}
