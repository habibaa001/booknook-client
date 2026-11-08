"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { BookOpen, LogOut, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Auto sync JWT token if user session exists but token is missing (Fixes Google Login 403 Forbidden)
  useEffect(() => {
    const syncToken = async () => {
      if (session?.user?.email) {
        const existingToken = localStorage.getItem("booknook_token");
        if (!existingToken) {
          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/jwt`,
              { email: session.user.email }
            );
            if (res.data.token) {
              localStorage.setItem("booknook_token", res.data.token);
            }
          } catch (err) {
            console.error("Failed to sync token", err);
          }
        }
      }
    };
    syncToken();
  }, [session]);

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("booknook_token");
    toast.success("Logged out successfully");
    setDropdownOpen(false);
    if (
      pathname.startsWith("/books/") ||
      pathname === "/add-book" ||
      pathname === "/my-books" ||
      pathname === "/my-borrows"
    ) {
      router.push("/");
    }
  };

  return (
    <nav className="bg-[#121c17] border-b border-[#21352b] sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-serif text-2xl font-bold">
          <div className="bg-[#64b587] text-[#121c17] p-1.5 rounded-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <span>BookNook</span>
        </Link>

        {/* Center: Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`${pathname === "/" ? "text-[#64b587]" : "text-gray-300 hover:text-white"}`}>Home</Link>
          <Link href="/books" className={`${pathname === "/books" ? "text-[#64b587]" : "text-gray-300 hover:text-white"}`}>All Books</Link>

          {session && (
            <>
              <Link href="/add-book" className={`${pathname === "/add-book" ? "text-[#64b587]" : "text-gray-300 hover:text-white"}`}>Add Book</Link>
              <Link href="/my-books" className={`${pathname === "/my-books" ? "text-[#64b587]" : "text-gray-300 hover:text-white"}`}>My Books</Link>
              <Link href="/my-borrows" className={`${pathname === "/my-borrows" ? "text-[#64b587]" : "text-gray-300 hover:text-white"}`}>My Borrows</Link>
            </>
          )}
        </div>

        {/* Right: Auth State */}
        <div className="flex items-center gap-4">
          {!session ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-300 hover:text-white text-sm font-medium">Login</Link>
              <Link href="/register" className="bg-[#64b587] text-[#121c17] px-4 py-2 rounded font-semibold text-sm hover:bg-[#529e73] transition">
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                <img
                  src={session.user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={session.user.name || "User"}
                  className="w-9 h-9 rounded-full border border-[#64b587] object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#17251f] border border-[#263e32] rounded-lg shadow-xl py-2 z-50 text-white">
                  <div className="px-4 py-2 border-b border-[#263e32]">
                    <p className="text-sm font-semibold truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 hover:bg-[#20332a] text-sm cursor-pointer">
                    <UserIcon className="w-4 h-4 text-[#64b587]" />
                    <span>My Profile</span>
                  </div>
                  <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#20332a] text-sm text-red-400 text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}