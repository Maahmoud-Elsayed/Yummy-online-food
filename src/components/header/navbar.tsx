import { Link } from "@/navigation";

import Container from "../ui/container";
import MotionDiv from "../ui/motion-div";
import Logo from "./logo";
import MobileNav from "./mobile-nav";
import NavItems from "./nav-items";
import { NavMenu } from "./nav-menu";
import { api } from "@/trpc/server";

const Navbar = async () => {
  const categories = (await api.categories.getAll()).categories;

  return (
    <MotionDiv
      initial={{ y: -65, opacity: 0 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <header className="sticky top-0 z-50 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <Container className="relative">
          <div className="flex h-16 items-center justify-between ">
            <div className="flex gap-2">
              <MobileNav categories={categories} />
              <div className="flex gap-8 ">
                <Link
                  className="flex  items-center justify-center text-foreground"
                  href="/"
                >
                  <Logo className="h-7 w-full md:h-9" />
                </Link>

                <div className="z-50 hidden md:flex md:justify-center md:self-stretch ">
                  <NavMenu categories={categories} />
                </div>
              </div>
            </div>
            <NavItems />
          </div>
        </Container>
      </header>
    </MotionDiv>
  );
};

export default Navbar;
