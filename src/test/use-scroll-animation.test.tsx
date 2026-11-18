import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  revert: vi.fn(),
}));

vi.mock("@/lib/gsap", () => ({
  gsap: { context: mocks.context },
}));

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({ matches }),
  });
}

function AnimatedBox({ onSetup }: { onSetup: (scope: HTMLDivElement) => void }) {
  const scope = useScrollAnimation<HTMLDivElement>(onSetup);
  return <div ref={scope} />;
}

describe("useScrollAnimation", () => {
  beforeEach(() => {
    mocks.context.mockReset();
    mocks.revert.mockReset();
    mocks.context.mockImplementation((callback: () => void) => {
      callback();
      return { revert: mocks.revert };
    });
    setReducedMotion(false);
  });

  it("não cria animações quando prefers-reduced-motion está ativo", () => {
    setReducedMotion(true);
    const onSetup = vi.fn();

    render(<AnimatedBox onSetup={onSetup} />);

    expect(mocks.context).not.toHaveBeenCalled();
    expect(onSetup).not.toHaveBeenCalled();
  });

  it("reverte o contexto do GSAP ao desmontar", () => {
    const { unmount } = render(<AnimatedBox onSetup={vi.fn()} />);

    expect(mocks.context).toHaveBeenCalledTimes(1);
    unmount();

    expect(mocks.revert).toHaveBeenCalledTimes(1);
  });
});
