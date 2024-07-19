import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef
} from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Input } from "../ui/input";
import PasswordStrengthChecker from "./password-strength-checker";

type PasswordFieldWithCheckerProps = {
  showPw?: boolean;
  pwStrength?: boolean;
} & ComponentPropsWithoutRef<"input">;

const PasswordFieldWithChecker = forwardRef<
  HTMLInputElement,
  PasswordFieldWithCheckerProps
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { pwStrength, showPw, onChange, ...rest } = props;

  const showPwHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...rest}
          ref={ref}
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            if (pwStrength) {
              setPassword(e.target.value);
              onChange?.(e);
            } else {
              onChange?.(e);
            }
          }}
        />
        {showPw ? (
          showPassword ? (
            <FaRegEyeSlash
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground ltr:right-5 rtl:left-5"
              onClick={showPwHandler}
            />
          ) : (
            <FaRegEye
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground ltr:right-5 rtl:left-5"
              onClick={showPwHandler}
            />
          )
        ) : null}
      </div>
      {pwStrength ? <PasswordStrengthChecker password={password} /> : null}
    </div>
  );
});

PasswordFieldWithChecker.displayName = "PasswordFieldWithChecker";

export default PasswordFieldWithChecker;
