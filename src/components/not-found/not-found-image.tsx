"use client";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const NotFoundImage = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  return (
    <div className="relative h-[360px] w-full mt-5">
      {isMobile ? (
        <Image src="/assets/images/404.webp" alt="404" fill />
      ) : (
        <Image src="/assets/images/404-desktop-bg.webp" alt="404" fill />
      )}
    </div>
  );
};

export default NotFoundImage;
