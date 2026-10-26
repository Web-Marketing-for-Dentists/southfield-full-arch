import { useEffect, useRef, useState } from "react";

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export default function CountUpNumber({
  target,
  suffix = "",
  duration = 1300,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let frame: number | undefined;
    let observer: IntersectionObserver | undefined;
    let disposed = false;

    const finish = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      started.current = true;
      observer?.disconnect();
      if (!disposed) setCount(target);
    };
    const animate = () => {
      if (started.current || disposed) return;
      started.current = true;
      observer?.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        if (disposed) return;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(progress === 1 ? target : Math.floor(target * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const onMotionChange = () => {
      if (motionPreference.matches) finish();
    };
    const onVisibilityChange = () => {
      // Do not leave an incomplete metric if the visitor switches tabs mid-count.
      if (document.hidden && started.current) finish();
    };

    if (
      motionPreference.matches ||
      started.current ||
      !("IntersectionObserver" in window)
    ) {
      finish();
    } else {
      observer = new IntersectionObserver(
        entries => {
          if (
            entries.some(
              entry => entry.isIntersecting && entry.intersectionRatio >= 0.35
            )
          )
            animate();
        },
        {
          threshold: 0.35,
          // Start only when the numbers are above the fixed mobile call footer.
          rootMargin: window.matchMedia("(max-width: 639px)").matches
            ? "0px 0px -90px 0px"
            : "0px 0px -24px 0px",
        }
      );
      observer.observe(
        element.closest("[data-doctor-authority-stats]") ?? element
      );
    }
    motionPreference.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      observer?.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
      motionPreference.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [target, duration]);

  return (
    <span
      ref={ref}
      data-count-up-target={target}
      className="tabular-nums whitespace-nowrap"
    >
      <span aria-hidden="true" data-count-up-display>
        {numberFormat.format(count)}
        {suffix}
      </span>
      <span className="sr-only">
        {numberFormat.format(target)}
        {suffix}
      </span>
    </span>
  );
}
