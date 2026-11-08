"use client";
import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import("../components/HomeContent"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#0f1713] min-h-screen flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-[#64b587] border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function Page() {
  return <HomeContent />;
}