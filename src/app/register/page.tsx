"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "BookNook | Register";
  }, []);

  const validatePassword = (pass: string): string => {
    if (pass.length < 6) return "Length must be at least 6 characters";
    if (!/[A-Z]/.test(pass)) return "Must have an Uppercase letter in the password";
    if (!/[a-z]/.test(pass)) return "Must have a Lowercase letter in the password";
    return "";
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      toast.error(error);
      return;
    }
    setPasswordError("");
    setLoading(true);

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        image: photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed");
      } else {
        toast.success("Registered successfully! Please login.");
        router.push("/login");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1713] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#15221c] border border-[#23382e] rounded-xl p-8">
        <h2 className="text-3xl font-serif font-bold text-white text-center mb-6">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
            />
          </div>

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
            <label className="text-xs font-semibold text-gray-300 block mb-1">Photo URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
              className="w-full bg-[#1b2b23] border border-[#263e32] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#64b587]"
            />
            {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#64b587] text-[#121c17] py-2.5 rounded font-semibold text-sm hover:bg-[#529e73] transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <hr className="w-full border-[#23382e]" />
          <span className="px-3 text-xs text-gray-500">OR</span>
          <hr className="w-full border-[#23382e]" />
        </div>

        <button
          type="button"
          onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
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
          Already have an account? <Link href="/login" className="text-[#64b587] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}