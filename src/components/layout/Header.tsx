
"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import MobileNav from "./MobileNav";

type HeaderProps = {
  pageLabel: string;
  user: {
    name: string | null;
    email: string | null;
    role: string;
  } | null;
};

export default function Header({ pageLabel, user }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("guidebook-theme");
    const isDark = savedTheme === "dark";

    // Apply the stored preference after hydration to avoid a server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleTheme() {
    setDarkMode((currentMode) => {
      const nextDarkMode = !currentMode;

      document.documentElement.classList.toggle("dark", nextDarkMode);
      window.localStorage.setItem(
        "guidebook-theme",
        nextDarkMode ? "dark" : "light"
      );

      return nextDarkMode;
    });
  }

  useEffect(() => {
    if (!profileOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const displayName = user?.name?.trim() || "Pengguna";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  const roleLabel = user?.role === "ADMIN"
    ? "ADMIN"
    : user?.role === "MENTOR"
      ? "MENTOR"
      : user?.role === "MAGANG"
        ? "MAGANG"
        : user?.role ?? "PENGGUNA";

  return (
    <header className="app-header fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-8 lg:left-[19rem]">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav isAdmin={user?.role === "ADMIN"} />

        <span className="truncate text-base font-semibold text-slate-800 sm:text-lg">
          Guidebook: PLAVON ke SIAK
        </span>

        <Icon
          name="chevron_right"
          className="hidden text-[18px] text-slate-400 sm:inline"
        />

        <span className="hidden text-[13px] font-normal text-slate-600 sm:inline">
          {pageLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          title={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          aria-label={darkMode ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <Icon
            name={darkMode ? "light_mode" : "dark_mode"}
            className="text-[20px]"
          />
        </button>

        {user && (
          <div ref={profileMenuRef} className="relative ml-1">
            <button
              type="button"
              aria-label={`Buka profil ${displayName}`}
              aria-expanded={profileOpen}
              aria-controls="profile-menu"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#003F87] text-xs font-semibold text-white shadow-sm transition-all hover:scale-105 hover:bg-[#0056B3] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
            >
              {initials}
            </button>

            {profileOpen && (
              <div
                id="profile-menu"
                className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#15558a] text-sm font-semibold text-white">{initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">{displayName}</span>
                      <span className="shrink-0 rounded-full bg-[#e3f0ff] px-2 py-0.5 text-[10px] font-bold text-[#15558a]">{roleLabel}</span>
                    </div>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{user.email || "-"}</span>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <Icon name="person" className="text-[19px] text-slate-600" />
                  <span>Lihat halaman profil</span>
                </Link>
                <LogoutButton />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
