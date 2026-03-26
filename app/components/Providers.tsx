"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Task 25: Persist theme across page navigation via localStorage
  useEffect(() => {
    const saved = localStorage.getItem("braj-theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Default is dark — ensure class is set
      document.documentElement.classList.add("dark");
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
