import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1713] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-serif font-bold text-[#64b587] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Shelf Not Found</h2>
      <p className="text-gray-400 max-w-sm mb-6 text-sm">The page or volume you are looking for has been misplaced or does not exist.</p>
      <Link href="/" className="bg-[#64b587] text-[#121c17] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#529e73]">
        Back to Home
      </Link>
    </div>
  );
}