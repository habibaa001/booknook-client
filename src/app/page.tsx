"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import { ArrowRight, BookOpen, Clock, ShieldCheck } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  availableCopies: number;
}

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "BookNook | Home";
    const fetchArrivals = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/books?sort=desc&limit=6`);
        setNewArrivals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArrivals();
  }, []);

  return (
    <div className="bg-[#0f1713] min-h-screen text-gray-200">
      {/* 1. Banner / Slider */}
      <section className="bg-[#121c17] py-14 px-6 border-b border-[#21352b]">
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500 }}
            className="rounded-xl overflow-hidden h-[340px]"
          >
            <SwiperSlide className="bg-gradient-to-r from-[#17251f] to-[#1d3027] flex flex-col justify-center p-12">
              <span className="text-[#64b587] uppercase text-xs tracking-widest font-semibold mb-2">Welcome to BookNook</span>
              <h2 className="text-4xl font-serif text-white font-bold mb-4">Discover Your Next Favorite Story</h2>
              <p className="text-gray-400 max-w-xl mb-6">Explore our curated collection of fiction, science, and historical classics from our community.</p>
              <div>
                <Link href="/books" className="bg-[#64b587] text-[#121c17] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition">
                  Browse Books
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide className="bg-gradient-to-r from-[#17251f] to-[#1a2d24] flex flex-col justify-center p-12">
              <span className="text-[#64b587] uppercase text-xs tracking-widest font-semibold mb-2">Community Sharing</span>
              <h2 className="text-4xl font-serif text-white font-bold mb-4">Add Your Shelf to the Digital Library</h2>
              <p className="text-gray-400 max-w-xl mb-6">Share reading treasures with passionate readers around you with one click.</p>
              <div>
                <Link href="/books" className="bg-[#64b587] text-[#121c17] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition">
                  Browse Books
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide className="bg-gradient-to-r from-[#17251f] to-[#20372c] flex flex-col justify-center p-12">
              <span className="text-[#64b587] uppercase text-xs tracking-widest font-semibold mb-2">Seamless Lending</span>
              <h2 className="text-4xl font-serif text-white font-bold mb-4">Borrow for 7 Days, Keep the Habit Alive</h2>
              <p className="text-gray-400 max-w-xl mb-6">Simple borrowing with real-time copy tracking and hassle-free returns.</p>
              <div>
                <Link href="/books" className="bg-[#64b587] text-[#121c17] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition">
                  Browse Books
                </Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* 2. New Arrivals */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">New Arrivals</h2>
          <p className="text-gray-400 text-sm">Recently added books waiting on the shelf</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#64b587] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {newArrivals.map((book) => (
              <div key={book._id} className="bg-[#15221c] border border-[#23382e] rounded-lg overflow-hidden flex flex-col">
                <div className="h-64 overflow-hidden bg-black/40">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#64b587] block mb-1">{book.category}</span>
                    <h3 className="text-white font-serif font-semibold text-base line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">by {book.author}</p>
                  </div>
                  <Link
                    href={`/books/${book._id}`}
                    className="w-full text-center bg-[#64b587] text-[#121c17] font-semibold text-xs py-2 rounded hover:bg-[#529e73] transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/books" className="inline-flex items-center gap-2 bg-transparent border border-[#64b587] text-[#64b587] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#64b587] hover:text-[#121c17] transition">
            See All Books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Extra Section 1: How Borrowing Works */}
      <section className="bg-[#121c17] py-16 px-6 border-t border-b border-[#21352b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-2">How Borrowing Works</h2>
            <p className="text-gray-400 text-sm">Three easy steps to start reading today</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-[#17251f] p-8 rounded-lg border border-[#23382e]">
              <div className="w-12 h-12 bg-[#64b587]/20 text-[#64b587] rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">1. Select a Book</h3>
              <p className="text-gray-400 text-sm">Browse our community catalogue and inspect real-time copy availability.</p>
            </div>

            <div className="bg-[#17251f] p-8 rounded-lg border border-[#23382e]">
              <div className="w-12 h-12 bg-[#64b587]/20 text-[#64b587] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">2. Confirm Borrow</h3>
              <p className="text-gray-400 text-sm">Confirm with your profile and borrow instantly for 7 continuous days.</p>
            </div>

            <div className="bg-[#17251f] p-8 rounded-lg border border-[#23382e]">
              <div className="w-12 h-12 bg-[#64b587]/20 text-[#64b587] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">3. Return Anytime</h3>
              <p className="text-gray-400 text-sm">Return directly from your My Borrows dashboard to restore copies for others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Top Categories */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Popular Categories</h2>
          <p className="text-gray-400 text-sm">Explore stories across your favorite genres</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Fiction", "Science", "History", "Kids"].map((cat) => (
            <Link key={cat} href="/books" className="bg-[#15221c] p-6 rounded-lg border border-[#23382e] hover:border-[#64b587] text-center transition group">
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#64b587]">{cat}</h3>
              <span className="text-xs text-gray-500 mt-1 block">Explore shelf</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}