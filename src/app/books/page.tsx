"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | All Books";
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0f1713] min-h-screen py-14 px-6 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">All Books</h1>
        <p className="text-gray-400 text-sm mb-10">Browse through our complete library collection</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#64b587] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {books.map((book) => (
              <div key={book._id} className="bg-[#15221c] border border-[#23382e] rounded-lg overflow-hidden flex flex-col">
                <div className="h-72 overflow-hidden bg-black/40">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#64b587] block mb-1">{book.category}</span>
                    <h3 className="text-white font-serif font-bold text-lg mb-1">{book.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">by {book.author}</p>
                  </div>
                  <Link
                    href={`/books/${book._id}`}
                    className="w-full text-center bg-[#64b587] text-[#121c17] font-semibold text-sm py-2 rounded hover:bg-[#529e73] transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}