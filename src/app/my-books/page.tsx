"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Edit2, X } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies: number;
  availableCopies: number;
  userEmail: string;
}

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | My Books";
    if (!isPending && !session) {
      router.push("/login?callbackUrl=/my-books");
      return;
    }
    if (session) {
      axios.get<Book[]>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books`)
        .then((res) => {
          const userBooks = res.data.filter((b) => b.userEmail === session.user.email);
          setBooks(userBooks);
        })
        .finally(() => setLoading(false));
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editBook) return;
    const token = localStorage.getItem("booknook_token");
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books/${editBook._id}`,
        editBook,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Book updated successfully!");
      setBooks(books.map((b) => (b._id === editBook._id ? editBook : b)));
      setEditBook(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const token = localStorage.getItem("booknook_token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books/${deleteTargetId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Book deleted!");
      setBooks(books.filter((b) => b._id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch {
      toast.error("Failed to delete book");
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">My Books</h1>
        <p className="text-gray-400 text-sm mb-8">Books you contributed to BookNook</p>

        {books.length === 0 ? (
          <p className="text-gray-400">You have not added any books yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#23382e]">
              <thead>
                <tr className="bg-[#15221c] text-xs text-gray-400 border-b border-[#23382e]">
                  <th className="p-4">Book</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Total Copies</th>
                  <th className="p-4">Available</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b._id} className="border-b border-[#23382e] hover:bg-[#15221c]/60">
                    <td className="p-4 flex items-center gap-3">
                      <img src={b.image} alt={b.title} className="w-12 h-16 object-cover rounded" />
                      <div>
                        <p className="font-semibold text-white text-sm">{b.title}</p>
                        <p className="text-xs text-gray-400">{b.author}</p>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#64b587]">{b.category}</td>
                    <td className="p-4 text-sm">{b.totalCopies}</td>
                    <td className="p-4 text-sm">{b.availableCopies}</td>
                    <td className="p-4 text-right space-x-2">
                      <button type="button" onClick={() => setEditBook(b)} className="p-2 bg-[#1b2b23] text-gray-300 hover:text-white rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteTargetId(b._id)} className="p-2 bg-[#2a1717] text-red-400 hover:text-red-300 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#17251f] border border-[#263e32] p-6 rounded-xl max-w-sm w-full">
            <h3 className="text-lg font-serif font-bold text-white mb-2">Delete Book</h3>
            <p className="text-sm text-gray-400 mb-6">Are you sure you want to remove this book from the library? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="px-4 py-2 text-sm text-gray-300 hover:text-white">Cancel</button>
              <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editBook && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#17251f] border border-[#263e32] p-6 rounded-xl max-w-lg w-full relative">
            <button type="button" onClick={() => setEditBook(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif font-bold text-white mb-4">Edit Book Details</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={editBook.title}
                  onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                  className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Author</label>
                <input
                  type="text"
                  value={editBook.author}
                  onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                  className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Category</label>
                <select
                  value={editBook.category}
                  onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                  className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-white"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Total Copies</label>
                <input
                  type="number"
                  value={editBook.totalCopies}
                  onChange={(e) => setEditBook({ ...editBook, totalCopies: Number(e.target.value) })}
                  className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-white"
                />
              </div>
              <button type="submit" className="w-full bg-[#64b587] text-[#121c17] py-2.5 rounded font-semibold text-sm hover:bg-[#529e73]">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}