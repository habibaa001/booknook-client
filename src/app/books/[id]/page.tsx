"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  userName?: string;
  userEmail?: string;
  availableCopies: number;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function BookDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBorrowModal, setShowBorrowModal] = useState<boolean>(false);
  const [borrowing, setBorrowing] = useState<boolean>(false);

  useEffect(() => {
    document.title = "BookNook | Book Details";
    if (!id) return;
    axios.get<Book>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => toast.error("Could not load book"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOpenBorrow = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/books/${id}`);
      return;
    }
    setShowBorrowModal(true);
  };

  const handleConfirmBorrow = async () => {
    if (!book || !session) return;
    const token = localStorage.getItem("booknook_token");
    setBorrowing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/borrows`,
        {
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image,
          userEmail: session.user.email,
          userName: session.user.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Book borrowed successfully!");
      setBook({ ...book, availableCopies: book.availableCopies - 1 });
      setShowBorrowModal(false);
      router.push("/my-borrows");
    } catch (err: unknown) {
      const errorObj = err as AxiosErrorResponse;
      const errorMessage = errorObj.response?.data?.message || "Failed to borrow book";
      toast.error(errorMessage);
    } finally {
      setBorrowing(false);
    }
  };

  if (loading || !book) {
    return (
      <div className="bg-[#0f1713] min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#64b587] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1713] min-h-screen py-16 px-6 text-gray-200">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Book Cover Image */}
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl border border-[#23382e] bg-black/40">
          <img src={book.image} alt={book.title} className="w-full h-auto object-cover" />
        </div>

        {/* Book Details Content */}
        <div className="w-full md:w-1/2">
          <span className="text-xs uppercase font-semibold text-[#64b587] tracking-wider mb-2 block">{book.category}</span>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">{book.title}</h1>
          <p className="text-sm text-gray-400 mb-6">by {book.author}</p>

          <p className="text-sm leading-relaxed text-gray-300 mb-8">{book.description}</p>

          <div className="bg-[#15221c] border border-[#23382e] rounded-lg p-4 mb-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-gray-400">Added by</p>
              <p className="text-xs font-semibold text-white truncate">{book.userName || "Admin"}</p>
              <p className="text-[10px] text-gray-500 truncate">{book.userEmail || "admin@booknook.app"}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Copies left</p>
              <p className="text-lg font-bold text-[#64b587]">{book.availableCopies}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {book.availableCopies > 0 ? (
              <button
                type="button"
                onClick={handleOpenBorrow}
                className="bg-[#64b587] text-[#121c17] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition"
              >
                Borrow This Book
              </button>
            ) : (
              <button type="button" disabled className="bg-gray-600 text-gray-300 px-6 py-2.5 rounded font-semibold text-sm cursor-not-allowed">
                Not Available
              </button>
            )}
            <Link href="/books" className="text-xs text-gray-400 hover:text-white transition">Back to all books</Link>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#17251f] border border-[#263e32] rounded-xl p-6 w-full max-w-sm text-white relative">
            <button type="button" onClick={() => setShowBorrowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif font-bold mb-1">Borrow &quot;{book.title}&quot;</h3>
            <p className="text-xs text-gray-400 mb-6">You can keep this book for 7 days.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">User Name</label>
                <input
                  type="text"
                  readOnly
                  value={session?.user.name || ""}
                  className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-gray-300 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">User Email</label>
                <input
                  type="email"
                  readOnly
                  value={session?.user.email || ""}
                  className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-gray-300 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleConfirmBorrow}
                  disabled={borrowing}
                  className="bg-[#64b587] text-[#121c17] px-5 py-2 rounded font-semibold text-sm hover:bg-[#529e73] transition"
                >
                  {borrowing ? "Confirming..." : "Confirm Borrow"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}