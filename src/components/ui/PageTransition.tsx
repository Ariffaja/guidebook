"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const EXIT_DURATION_MS = 140;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleNavigationClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const routeButton = target.closest<HTMLElement>("[data-route-href]");
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      const href = routeButton?.dataset.routeHref ?? anchor?.href;
      if (!href || (anchor && (anchor.target && anchor.target !== "_self" || anchor.hasAttribute("download")))) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      document.documentElement.classList.add("route-transitioning");
      window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, EXIT_DURATION_MS);
    }

    document.addEventListener("click", handleNavigationClick, true);
    return () => document.removeEventListener("click", handleNavigationClick, true);
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.remove("route-transitioning");
  }, [pathname]);

  return (
    <div key={pathname} className="route-page">
      {children}
    </div>
  );
}
