import { cn } from "@/lib/utils";
import { ImSpinner9 } from "react-icons/im";
import { Button, type ButtonProps } from "./button";
import { useTranslations } from "next-intl";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  className,
  isLoading = false,
  children,
  loadingText,
  ...props
}) => {
  const t = useTranslations("ui");
  return (
    <Button
      className={cn(
        " flex items-center gap-2 disabled:pointer-events-auto disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <ImSpinner9 className="h-4 w-4 animate-spin" />
          <span>{loadingText ?? t("wait")}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
