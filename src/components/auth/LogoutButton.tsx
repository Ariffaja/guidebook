"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Icon from "@/components/ui/Icon";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setIsSigningOut(true);
    setError(null);

    try {
      await signOut({ redirectTo: "/login" });
    } catch {
      setIsSigningOut(false);
      setError("Logout gagal. Silakan coba lagi.");
    }
  }

  return (
    <div className="border-t border-slate-100">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#c74343] transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0056B3] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon name="logout" className="text-[19px]" />
        {isSigningOut ? "Keluar..." : "Keluar"}
      </button>
      {error && (
        <p role="alert" className="px-4 pb-3 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
