"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const syncJwt = async (userEmail: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/jwt`, { email: userEmail });
      if (res.data.token) {
        localStorage.setItem("booknook_token", res.data.token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn.email({ email, password });
      if (res.error) {
        toast.error(res.error.message || "Invalid credentials");
      } else {
        await syncJwt(email);
        toast.success("Logged in successfully!");
        router.push(callbackUrl);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });
  };

  return (
    <div className="w-full max-w-md bg-[#15221c] border border-[#23382e] rounded-xl p-8">
      <h2 className="text-3xl font-serif font-bold text-white text-center mb-6">Welcome Back</h2>
      
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
          />
        </div>

        <div className="flex justify-end">
          <span className="text-xs text-[#64b587] cursor-pointer hover:underline">Forget Password</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#64b587] text-[#121c17] py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center justify-between">
        <hr className="w-full border-[#23382e]" />
        <span className="px-3 text-xs text-gray-500">OR</span>
        <hr className="w-full border-[#23382e]" />
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-[#263e32] bg-[#1b2b23] py-2.5 rounded text-white text-sm hover:bg-[#20332a] transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        Continue with Google
      </button>

      <p className="mt-6 text-center text-xs text-gray-400">
        Don&apos;t have an account? <Link href="/register" className="text-[#64b587] font-semibold hover:underline">Register</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f1713] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-white text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}