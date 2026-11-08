"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import toast from "react-hot-toast";

interface BorrowRecord {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
    if (!isPending && !session) {
      router.push("/login?callbackUrl=/my-borrows");
      return;
    }
    if (session?.user?.email) {
      const token = localStorage.getItem("booknook_token");
      axios.get<BorrowRecord[]>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/borrows?email=${session.user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => setBorrows(res.data))
        .catch(() => toast.error("Failed to fetch borrows"))
        .finally(() => setLoading(false));
    }
  }, [session, isPending, router]);

  const handleReturn = async (borrowId: string) => {
    const token = localStorage.getItem("booknook_token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/borrows/${borrowId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Book returned successfully!");
      setBorrows(borrows.filter((b) => b._id !== borrowId));
    } catch {
      toast.error("Failed to return book");
    }
  };

  if (isPending || loading) {
    return (
      <div className="bg-[#0f1713] min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#64b587] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1713] min-h-screen py-16 px-6 text-gray-200">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">My Borrows</h1>
        <p className="text-gray-400 text-sm mb-8">Manage the books you have borrowed</p>

        {borrows.length === 0 ? (
          <p className="text-gray-400">You have no borrowed books right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#23382e]">
              <thead>
                <tr className="bg-[#15221c] text-xs text-gray-400 border-b border-[#23382e]">
                  <th className="p-4">Book</th>
                  <th className="p-4">Borrow Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((b) => (
                  <tr key={b._id} className="border-b border-[#23382e] hover:bg-[#15221c]/60">
                    <td className="p-4 flex items-center gap-3">
                      <img src={b.bookImage} alt={b.bookTitle} className="w-12 h-16 object-cover rounded" />
                      <span className="font-semibold text-white text-sm">{b.bookTitle}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-300">{b.borrowDate}</td>
                    <td className="p-4 text-xs text-[#64b587]">{b.returnDate}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleReturn(b._id)}
                        className="bg-[#64b587] text-[#121c17] px-4 py-1.5 rounded text-xs font-semibold hover:bg-[#529e73] transition"
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}