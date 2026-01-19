// src/lib/auth.ts
import { apiFetch } from "./api";

export async function login(email: string, password: string) {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Logging in with:", { email, password });
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`)
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
    method: "POST",
    credentials: "include", // important for cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(res => res.json());
}

export async function refreshToken() {
  return apiFetch("/auth/refresh", {
    method: "POST",
  });
}

export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}
