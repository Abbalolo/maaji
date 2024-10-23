"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserContextData } from '../context/userData';
import Link from 'next/link';
interface MenuBarProps {
    setToggleMenu: (value: boolean) => void;
  }
  
function MenuBar({setToggleMenu}: MenuBarProps) {
    const {isAdmin} = useUserContextData()
    const [loading, setLoading] = useState<boolean>(false);
    const [isLogOut, setIsLogOut] = useState<boolean>(false);
    const router = useRouter();


    const handleLogOut = () => {
        setLoading(true);
        signOut(auth)
          .then(() => {
            router.push("/auth/login");
          })
          .catch((error) => {
            console.error("Sign out error:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      };

    const handleAdmin = () => {
        router.push("/admin")
        setToggleMenu(false)
    }
    
  return (
    <div className='fixed right-0 top-0 w-[50%] h-[89%] bg-[#25262A] transition-all duration-500 ease-out '>
 {isLogOut && (
        <div className="fixed w-full top-0 left-0 bg-[#1a1818b0] h-screen z-[10] flex justify-center items-center ">
          <div className="bg-[#1b1b29] border border-slate-600 shadow-lg md:w-[30%] w-[70%] h-[200px] gap-3 flex flex-col justify-center items-center rounded-md">
            <h3 className="font-semibold">Logout Confirmation</h3>
            <p>Are you sure you want to log out?</p>
            <div className="">
              <button onClick={() => setIsLogOut(false)} className="text-gray-200 px-4 py-2">
                Cancel
              </button>
              <button onClick={handleLogOut} className="text-red-400 px-4 py-2">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

     
      <button
        disabled={loading}
        onClick={() => setIsLogOut(true)}
        className="flex justify-center text-white text-sm bg-red-500 py-2 gap-2 items-center px-5"
      >
        <LogOut /> Log out
      </button>
      {isAdmin && 
      <div className="px-5">
        <Button onClick={handleAdmin} className='bg-blue-500 mt-5'>Admin Pane</Button>
<div className="flex flex-col gap-3 mt-3">
<Link href="/admin/fixtures">-Fixtures</Link>
<Link href="/admin/tables">-Tables</Link>
<Link href="/admin/finish-match">-Finished match</Link>
</div>
        </div>
      
      }
    </div>
  )
}

export default MenuBar