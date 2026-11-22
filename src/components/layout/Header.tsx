
"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import LogoutButton from "@/components/auth/LogoutButton";
import ChangeOwnPasswordForm from "@/components/accounts/ChangeOwnPasswordForm";
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
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
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

        <button
          type="button"
          title="Pengaturan"
          aria-label="Pengaturan"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <Icon name="settings" className="text-[20px]" />
        </button>

        {user && (
          <div ref={profileMenuRef} className="relative ml-1">
            <button
              type="button"
              aria-label={`Buka profil ${displayName}`}
              aria-expanded={profileOpen}
              aria-controls="profile-menu"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003F87] text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0056B3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3]"
            >
              {initials}
            </button>

            {profileOpen && (
              <div
                id="profile-menu"
                className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
              >
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Profil pengguna
                </p>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500">Nama</dt>
                    <dd className="truncate font-medium text-slate-800">
                      {displayName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Email</dt>
                    <dd className="break-all font-medium text-slate-800">
                      {user.email || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Role</dt>
                    <dd className="font-medium text-slate-800">{user.role}</dd>
                  </div>
                </dl>
                <button type="button" onClick={() => setPasswordFormOpen((open) => !open)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-[#0056B3] hover:bg-blue-50">
                  {passwordFormOpen ? "Tutup ubah sandi" : "Ubah sandi"}
                </button>
                {passwordFormOpen && <ChangeOwnPasswordForm />}
                <LogoutButton />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
