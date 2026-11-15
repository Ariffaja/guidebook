"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

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
    <div className="mt-4 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#003F87] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0056B3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? "Keluar..." : "Logout"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
