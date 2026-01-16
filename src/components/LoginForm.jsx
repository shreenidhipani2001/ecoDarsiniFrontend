"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      console.log("Login response:", data);

      if (!data) {
        setError("Invalid credentials.");
        return;
      }

      if (data.message === "Please check the credentials") {
        setError("Invalid credentials.");
        return;
      }

      if (data.role === "ADMIN") {
        console.log('role:-', data.role);
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col gap-6 p-10 bg-white rounded-xl shadow-lg"
    >
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-red-600 text-center">
        Login
      </h2>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="border border-zinc-300 placeholder-black text-black p-3 rounded-[60px] focus:outline-none focus:ring-2 focus:ring-red-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="border border-zinc-300 placeholder-black text-black p-3 rounded-[60px] focus:outline-none focus:ring-2 focus:ring-red-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Error Message – ABOVE BUTTON */}
      {error && (
        <p className="text-red-500 text-sm text-center -mt-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="bg-black text-white py-3 rounded-[60px] font-semibold hover:opacity-90 transition"
      >
        Login
      </button>
    </form>
  );
}
