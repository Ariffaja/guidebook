"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import Sidebar from "./Sidebar";

/**
 * Menu geser untuk layar di bawah breakpoint lg (tablet/ponsel), tempat Sidebar tetap disembunyikan.
 * Tombol hanya tampil di bawah lg, sehingga tampilan desktop tidak berubah.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Buka menu navigasi"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] lg:hidden"
      >
        <Icon name="menu" className="text-[22px]" />
      </button>

      {open && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/40"
          />
          <Sidebar drawer onNavigate={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
