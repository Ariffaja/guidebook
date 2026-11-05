import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GUIDEBOOK ADMINDUK - Disdukcapil Sidoarjo",
  description:
    "Panduan operasional internal alur PLAVON ke SIAK untuk operator Dinas Kependudukan dan Pencatatan Sipil Kabupaten Sidoarjo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Font ikon Material Symbols, sama seperti referensi desain */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#F7F9FB] antialiased`}>{children}</body>
    </html>
  );
}
