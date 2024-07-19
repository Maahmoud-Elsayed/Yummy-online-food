import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipWrapperProps = {
  children: React.ReactNode;
  text: string;
  side?: "top" | "bottom" | "left" | "right";
  asChild?: boolean;
};

export function TooltipWrapper({
  children,
  text,
  side,
  asChild,
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild ?? false}>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-black text-white"
          side={side ? side : "top"}
        >
          <div>{text}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
