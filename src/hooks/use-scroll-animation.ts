import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  createAnimation: (scope: T) => void,
) {
  const scope = useRef<T>(null);
  const createAnimationRef = useRef(createAnimation);
  createAnimationRef.current = createAnimation;

  useEffect(() => {
    const element = scope.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!element || reducedMotion) return;

    const context = gsap.context(() => {
      createAnimationRef.current(element);
    }, element);

    return () => context.revert();
  }, []);

  return scope;
}
