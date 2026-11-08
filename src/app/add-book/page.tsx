"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import toast from "react-hot-toast";

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AddBookPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [category, setCategory] = useState<string>("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(4);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
    if (!isPending && !session) {
      router.push("/login?callbackUrl=/add-book");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please upload an image file");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);
      const imgRes = await axios.post<{ data: { url: string } }>(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        formData
      );
      const imageUrl = imgRes.data.data.url;

      // 2. Save Book to Backend
      const token = localStorage.getItem("booknook_token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books`,
        {
          title,
          author,
          category,
          totalCopies: Number(totalCopies),
          image: imageUrl,
          description,
          userName: session?.user.name,
          userEmail: session?.user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Book added successfully!");
      router.push("/my-books");
    } catch (err: unknown) {
      const errorObj = err as AxiosErrorResponse;
      const errorMessage = errorObj.response?.data?.message || "Failed to add book";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) return null;

  return (
    <div className="bg-[#0f1713] min-h-screen py-16 px-6 text-gray-200">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Add a Book</h1>
          <p className="text-xs text-gray-400">Put a book from your shelf into the library.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#15221c] border border-[#23382e] p-8 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">Book Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 block mb-1">Author Name</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
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
                min="1"
                required
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Book Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-xs text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#64b587] file:text-[#121c17]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Short Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 block mb-1">User Name</label>
              <input
                type="text"
                readOnly
                value={session.user.name || ""}
                className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 block mb-1">User Email</label>
              <input
                type="email"
                readOnly
                value={session.user.email || ""}
                className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#64b587] text-[#121c17] py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition mt-4"
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}