import { cn } from "@/lib/utils";
import { ImSpinner9 } from "react-icons/im";

const LoadingSpinner = ({ className }: { className?: string }) => {

  return (
    <div
      className={cn(
        "flex h-[50vh] w-full flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <ImSpinner9 className="h-20 w-20 animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;
