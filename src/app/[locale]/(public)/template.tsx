"use client";

import MotionDiv from "@/components/ui/motion-div";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionDiv
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ ease: "easeIn", duration: 0.5 }}
    >
      {children}
    </MotionDiv>
  );
}
