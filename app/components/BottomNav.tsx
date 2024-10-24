"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { House, Menu, UserRound, X } from "lucide-react";
import MenuBar from "./MenuBar";

function BottomNav() {
  const router = useRouter();
  const pathName = usePathname();
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);

  // Determine current page
  const isDashboard = pathName === "/home";
  const isProfile = pathName === "/profile";
  const isAdminPage = pathName === "/admin";
  const isAdminFixtures = pathName === "/admin/fixtures";

  const isActive = (path: string) => pathName === path;

  // Handle navigation for user menu
  const handleUserMenuClick = () => {
    setToggleMenu(false);
    router.push("/profile");
  };

  return (
    <>
      {(isDashboard || isProfile || isAdminPage || isAdminFixtures) && (
        <nav className="bg-[#25262A] dark:text-white p-3 fixed bottom-0 left-0 w-full z-50 rounded-t-xl md:hidden transition-all duration-500 ease-out">
          <ul className="flex justify-between items-center text-slate-300">
            <div className="flex justify-around items-center w-full">
              <button
                onClick={handleUserMenuClick}
                className="rounded-lg relative flex flex-col gap-1 items-center justify-center hover:font-semibold"
              >
                <UserRound className="text-[20px]" />
                Profile
              </button>

              <Link
                href="/home"
                className={`${
                  isActive("/home") ? "font-semibold" : "text-slate-300 dark:text-white"
                } rounded-lg flex items-center justify-center hover:font-semibold`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <House className="text-[20px]" />
                  Home
                </div>
              </Link>

              <button
                onClick={() => setToggleMenu(!toggleMenu)}
                className="rounded-lg flex flex-col gap-1 items-center justify-center transition-all duration-400 ease-in-out"
              >
                {toggleMenu ? (
                  <X className="text-[20px]" />
                ) : (
                  <Menu className="text-[20px]" />
                )}
                Menu
              </button>
            </div>
          </ul>
          {toggleMenu && (
            <>
            <div onClick={() => setToggleMenu(false)} className="bg-[#25262A] opacity-[0.7] fixed top-0 left-0 w-full h-screen -z-[1]"></div>
            <MenuBar setToggleMenu={setToggleMenu} />
            </>
          ) }
            
        </nav>
      )}
    </>
  );
}

export default BottomNav;
