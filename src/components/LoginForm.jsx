"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Submitting login form");

    try {
      const data = await login(email, password);
      console.log("Login response:", data);

      if (!data || data.message === "Please check the credentials") {
        setError("Invalid credentials.");
        return;
      }
      const user = data;
      console.log("Logged in user:", user);

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else if (data.role === "USER") {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
      
    } catch (err) {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col gap-6 p-10 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-red-600 text-center">
        Please Login 
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="border border-zinc-300 placeholder-black text-black p-3 rounded-[60px] focus:outline-none focus:ring-2 focus:ring-red-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border border-zinc-300 placeholder-black text-black p-3 rounded-[60px] focus:outline-none focus:ring-2 focus:ring-red-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-red-500 text-sm text-center -mt-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="bg-black text-white py-3 rounded-[60px] font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        disabled={loading} // prevent multiple clicks
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            ></path>
          </svg>
        )}
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

