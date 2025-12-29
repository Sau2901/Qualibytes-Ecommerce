"use client";

import { authenticated, removeCookies } from "@/app/actions";
import Logo from "@/assets/Logo";
import { setAuthenticated } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoChevronDownOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import MobileMenu from "./MobileMenu";
import Modal from "./Modal";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";
import { ToggleTheme } from "./ToggleTheme";
import { Button } from "./ui/button";

const links = [
  { title: "Shops", url: "/shops" },
  { title: "Contact", url: "/contact" },
  { title: "Offers", url: "/offers" },
  {
    title: "Pages",
    url: "",
    subLinks: [
      { title: "Profile", url: "/profile" },
      { title: "Contact Us", url: "/contact" },
      { title: "Checkout", url: "/checkout" },
      { title: "Orders", url: "/profile/orders" },
    ],
  },
];

const Navbar = () => {
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.authSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const authentication = async () => {
      try {
        const res = await authenticated();
        dispatch(setAuthenticated(res));
      } catch (error) {
        console.log(error);
      }
    };

    authentication();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await removeCookies();
      setIsConfirm(false);
      dispatch(setAuthenticated(false));
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="navbar px-default py-3 bg-secondary shadow-lg border-b sticky top-0 left-0 z-50">
        <nav className="flex gap-6 items-center justify-between">
          {/* LOGO + SEARCH */}
          <div className="left flex gap-6 items-center flex-1">
            <Logo />

            <div className="search flex-1 max-w-sm hidden md:block">
              <SearchBar />
            </div>
          </div>

          <div className="right flex gap-6 items-center">
            <div className="flex gap-5 items-center">
              <div className="links hidden lg:block">
                <ul className="flex gap-6 items-center">
                  {links.map((link) => (
                    <li className="group relative" key={link.url}>
                      <Link
                        href={link.url}
                        className="flex gap-1 items-center group-hover:text-blue-600 transition-colors duration-300"
                      >
                        {link.title}
                        {link.subLinks && <IoChevronDownOutline />}
                      </Link>

                      {link.subLinks && (
                        <ul className="invisible scale-95 translate-y-2 opacity-0 absolute top-[130%] right-0 w-[160px] border bg-card rounded-lg transition-all duration-150 shadow-lg p-0.5 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 group-hover:opacity-100">
                          {link.subLinks.map((sub) => (
                            <li key={sub.url}>
                              <Link
                                className="block px-3 py-2 hover:bg-accent rounded-lg"
                                href={sub.url}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="menu text-3xl hidden md:block lg:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <HiMenuAlt2 />
            </button>

            {/* PROFILE MENU */}
            {isAuthenticated && <ProfileMenu setIsOpen={setIsConfirm} />}

            <div className="hidden lg:block">
              <ToggleTheme />
            </div>

            {/* JOIN BUTTON — BLUE THEME */}
            {!isAuthenticated && (
              <Link href="/login">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                >
                  Join
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <MobileMenu isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        className="w-fit h-fit"
      >
        <div className="p-5 rounded-lg flex flex-col justify-center items-center text-center gap-3">
          <h2 className="text-lg">Are you sure to logout?</h2>
          <div className="flex justify-between items-center gap-4">
            <Button onClick={() => setIsConfirm(false)}>No</Button>

            <Button
              variant="outline"
              className="border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={handleLogout}
            >
              Ok
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;