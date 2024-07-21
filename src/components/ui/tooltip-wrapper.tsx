import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

type TooltipWrapperProps = {
  children: React.ReactNode;
  text: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function TooltipWrapper({ children, text, side }: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        {children}
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
