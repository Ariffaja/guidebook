"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const documentationNav: NavItem[] = [
  { label: "Pendaftaran Kependudukan", href: "/dafduk", icon: "badge" },
  { label: "Pencatatan Sipil", href: "/capil", icon: "assignment" },
];

// Halaman Tools belum dibuat; href "#" sebagai placeholder sampai ada tugas khusus.
const toolsNav: NavItem[] = [
  { label: "SOP Directory", href: "#", icon: "menu_book" },
  { label: "Troubleshooting", href: "#", icon: "build" },
];

function NavSection({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <div className="px-6 pt-6">
      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </div>
      <nav className="flex flex-col gap-1" aria-label={title}>
        {items.map((item) => {
          const active =
            item.href !== "#" &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-[#0056B3]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon
                name={item.icon}
                className={`text-[20px] ${active ? "text-[#0056B3]" : "text-slate-500"}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-72 flex-col justify-between border-r border-slate-200/80 bg-white shadow-sm lg:flex">
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Brand */}
        <Link
          href="/"
          className="flex h-16 items-center gap-3 border-b border-slate-100 px-6"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#003F87] text-white shadow-sm">
            <Icon name="hub" className="text-[20px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight text-slate-900">SIAK Guide</span>
            <span className="text-[11px] font-normal leading-tight text-slate-500">
              Sistem Integrasi PLAVON
            </span>
          </div>
        </Link>

        <NavSection title="Dokumentasi" items={documentationNav} pathname={pathname} />
        <NavSection title="Tools" items={toolsNav} pathname={pathname} />
      </div>

      {/* Operator profile */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-2 shadow-sm">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#003F87] text-white">
            <Icon name="person" className="text-[18px]" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold text-slate-800">Operator Pusat</span>
            <span className="truncate text-[11px] leading-tight text-slate-500">Admin Access</span>
          </div>
          <Icon name="verified_user" className="flex-shrink-0 text-[18px] text-[#006A6A]" />
        </div>
      </div>
    </aside>
  );
}
