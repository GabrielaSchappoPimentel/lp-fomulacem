import { useEffect } from "react";
import type Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useSmoothScroll() {
  useEffect(() => {
    let alive = true;
    let lenis: Lenis | null = null;
    let stopLenis: (() => void) | undefined;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor || !lenis) return;

      const target = document.querySelector(anchor.getAttribute("href")!);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { immediate: reducedMotion });
    };

    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;

      document.documentElement.style.scrollBehavior = "auto";
      lenis = new Lenis({
        lerp: reducedMotion ? 1 : 0.08,
        smoothWheel: !reducedMotion,
      });
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      stopLenis = () => {
        gsap.ticker.remove(tick);
        lenis?.off("scroll", ScrollTrigger.update);
        lenis?.destroy();
        lenis = null;
      };
    });

    document.addEventListener("click", onClick);

    return () => {
      alive = false;
      stopLenis?.();
      document.removeEventListener("click", onClick);
    };
  }, []);
}
