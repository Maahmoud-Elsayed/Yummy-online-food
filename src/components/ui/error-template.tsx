import { cn } from "@/lib/utils";

const ErrorTemplate = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "my-5 w-full rounded-md border-destructive bg-red-50 px-4 ltr:border-l-4 rtl:border-r-4 ",
        className,
      )}
    >
      <div className="flex items-center  py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-destructive"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>

        <div className="text-start ltr:ml-3 rtl:mr-3">
          <p className="mt-1 text-sm text-destructive">{children}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorTemplate;
