"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MotionDiv from "@/components/ui/motion-div";
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
      className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 px-2.5"
    >
      <Card className="space-y-4 rounded-lg bg-white p-8 text-center shadow-lg">
        <h2 className=" text-xl font-semibold text-destructive">
          {t("title")}
        </h2>
        <p className="max-w-prose  text-muted-foreground">{t("description")}</p>

        <Button variant="outline" size="lg" onClick={() => reset()}>
          {t("tryAgain")}
        </Button>
      </Card>
    </MotionDiv>
  );
}
