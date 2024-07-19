"use client";
import { cn } from "@/lib/utils";
import { FaCheckCircle } from "react-icons/fa";

import { useEffect, useState } from "react";

const PasswordStrengthChecker = ({ password }: { password: string }) => {
  const [passwordScore, setPasswordScore] = useState(0);
  const passwordStrenth = ["Too weak", "Weak", "Medium", "Strong", "Strong"];

  useEffect(() => {
    if (!password) {
      return setPasswordScore(0);
    }

    let score = 1;

    if (password.length >= 8) {
      score += 1;

      if (/[A-Z]/.test(password)) {
        score += 1;
      }
      if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        score += 1;
      }
      if (/\d/.test(password)) {
        score += 1;
      }
    }
    setPasswordScore(score);
  }, [password]);

  return (
    <>
      {passwordScore > 0 && (
        <div className=" flex items-center justify-between gap-4 ">
          <div className="flex grow items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full">
                <div
                  className={`h-[3px] rounded-xl transition-colors ${
                    i < passwordScore
                      ? passwordScore <= 2
                        ? "bg-red-400"
                        : passwordScore <= 3
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
            ))}
          </div>
          <span
            className={cn(
              "flex min-w-[63.5px] items-center justify-end gap-1 text-xs italic",
              {
                "text-red-500": passwordScore <= 2,
                "text-yellow-500": passwordScore === 3,
                "text-green-500": passwordScore >= 4,
              },
            )}
          >
            {passwordScore === 4 && (
              <FaCheckCircle className="inline h-4 w-4 fill-primary text-transparent  " />
            )}
            {passwordStrenth[passwordScore - 1]}
          </span>
        </div>
      )}
    </>
  );
};

export default PasswordStrengthChecker;
