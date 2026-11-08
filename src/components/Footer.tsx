import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#121c17] border-t border-[#21352b] text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-serif text-2xl font-bold mb-3">
            <div className="bg-[#64b587] text-[#121c17] p-1.5 rounded-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <span>BookNook</span>
          </div>
          <p className="text-sm leading-relaxed">
            A small neighbourhood library on the web. Share the books on your shelf and borrow the ones you have been meaning to read.
          </p>
        </div>

        <div>
          <h4 className="text-white font-serif text-lg font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#64b587]" /> hello@booknook.app</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#64b587]" /> +880 1700 000 000</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#64b587]" /> 12 Reading Lane, Dhaka</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-serif text-lg font-semibold mb-3">Follow us</h4>
          <div className="flex items-center gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1b2b23] flex items-center justify-center hover:text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1b2b23] flex items-center justify-center hover:text-white transition">f</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1b2b23] flex items-center justify-center hover:text-white transition">ig</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#21352b] text-center text-xs">
        © 2026 BookNook Library Platform. All rights reserved.
      </div>
    </footer>
  );
}