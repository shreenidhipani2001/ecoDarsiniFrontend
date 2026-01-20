// // src/lib/auth.ts
// import { apiFetch } from "./api";

// export async function login(email: string, password: string) {
//   console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
//   console.log("Logging in with:", { email, password });
//   console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`)
//   return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
//     method: "POST",
//     credentials: "include", // important for cookies
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   }).then(res => res.json());
// }

// export async function refreshToken() {
//   return apiFetch("/auth/refresh", {
//     method: "POST",
//   });
// }

// export async function logout() {
//   return apiFetch("/auth/logout", {
//     method: "POST",
//   });
// }

import { apiFetch } from "./api";
import { useAuthStore } from "../../ecoDarsiniFrontend/src/store/useAuthStore";
// import { useAu thStore } from "../store/useAuthStore";

/* ================= LOGIN ================= */
export async function login(email: string, password: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
    {
      method: "POST",
      credentials: "include", // ✅ cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  console.log("Login Response Data:", data);

  if (data) {
    console.log("Setting user in auth store:", data);
    useAuthStore.getState().setUser(data);
    console.log("User after setting in store:", useAuthStore.getState().user);
  }

  return data;
}

/* ================= CURRENT USER ================= */
// export async function getCurrentUser() {
//   console.log('userAurh getCurrentUser:- ', useAuthStore.getState().user);
//   const userInStore = useAuthStore.getState().user;
//   console.log("User in Store:", userInStore);
   
//   const id = userInStore?.userId;
//   console.log("User ID from Store:", id);
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
//     {
//       method: "POST",
//       credentials: "include",
//       body: JSON.stringify({ id }),
      
//     }
//   );

//   if (!res.ok) return null;

//   const data = await res.json();
//   console.log("Current User Data:", data);
//   return data.user ?? null;
// }
export async function getCurrentUser() {
  const userInStore = useAuthStore.getState().user;

  console.log("User in Store:", userInStore);

 

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userInStore.userId,
      }),
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  console.log("Current User Data:", data);

  return data ?? null;
}


/* ================= LOGOUT ================= */
export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  useAuthStore.getState().clearUser();
}
