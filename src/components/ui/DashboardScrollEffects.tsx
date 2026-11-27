"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function DashboardScrollEffects({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      eventsTarget: scope,
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const intro = scope.querySelector<HTMLElement>("[data-dashboard-intro]");
      if (intro) {
        gsap.fromTo(intro, { autoAlpha: 0, y: 12 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        });
      }

      const revealItems = scope.querySelectorAll<HTMLElement>("[data-dashboard-reveal]");
      revealItems.forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 16 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 92%",
            once: true,
          },
        });
      });
    }, scope);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
      ScrollTrigger.refresh();
    };
  }, []);

  return <div ref={scopeRef} className="dashboard-scroll-scope">{children}</div>;
}
