const SuccessTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-5 w-full rounded-md border-green-500 bg-green-50  px-4 ltr:border-l-4 rtl:border-r-4 ">
      <div className="flex items-center  py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 rounded-full text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>

        <div className="text-start ltr:ml-3 rtl:mr-3">
          <p className="mt-1 text-sm text-green-600">{children}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessTemplate;
