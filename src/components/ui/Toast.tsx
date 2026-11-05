"use client";

import { useEffect, useState, type ReactNode } from "react";
import Icon from "./Icon";

type ToastProps = {
  icon: string;
  children: ReactNode;
  /** Harus stabil (useCallback) agar timer tidak diulang. */
  onClose: () => void;
};

/**
 * Notifikasi sementara di kanan bawah (setara banner di HTML Stitch):
 * tampil 2,5 detik, memudar 0,3 detik, lalu memanggil onClose.
 * Render dengan `key` unik supaya setiap notifikasi baru memulai timer dari awal.
 */
export default function Toast({ icon, children, onClose }: ToastProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2500);
    const closeTimer = setTimeout(onClose, 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-[#2d3133] px-5 py-3.5 text-[#eff1f3] shadow-xl transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <Icon name={icon} className="text-[22px] text-[#93f2f2]" />
      <span className="text-[13px]">{children}</span>
    </div>
  );
}
