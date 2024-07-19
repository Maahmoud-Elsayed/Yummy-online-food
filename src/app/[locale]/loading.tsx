import { ImSpinner9 } from "react-icons/im";

const Loading = () => {

  return (
    <div className="relative h-[calc(100vh-64px)] w-full">
      <div className="absolute left-1/2 top-1/2 z-40 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center  justify-center gap-2 bg-transparent ">
        <ImSpinner9 className="h-20 w-20 animate-spin text-primary" />
      </div>
    </div>
  );
};

export default Loading;
