import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type NetworkConnection = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
};

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

export default function HeroVideoBackground({
  desktopSrc,
  mobileSrc,
  poster,
}: {
  desktopSrc: string;
  mobileSrc: string;
  poster: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string>();
  const [ready, setReady] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: NetworkConnection }
    ).connection;
    const host = window as IdleWindow;
    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let disposed = false;

    const clearScheduled = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (idleId !== undefined) host.cancelIdleCallback?.(idleId);
      timeoutId = undefined;
      idleId = undefined;
    };
    const blocked = () =>
      reducedMotion.matches ||
      Boolean(connection?.saveData) ||
      ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
    const attachSource = () => {
      if (disposed || blocked()) return;
      setSource(
        window.matchMedia("(max-width: 767px)").matches ? mobileSrc : desktopSrc
      );
    };
    const schedule = () => {
      clearScheduled();
      if (blocked()) {
        setSource(undefined);
        setReady(false);
        return;
      }
      // The title, offer and CTA render first. Media is attached only when idle.
      if (host.requestIdleCallback) {
        idleId = host.requestIdleCallback(attachSource, { timeout: 2000 });
      } else {
        timeoutId = window.setTimeout(attachSource, 1200);
      }
    };
    const onPolicyChange = () => schedule();
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    reducedMotion.addEventListener("change", onPolicyChange);
    connection?.addEventListener("change", onPolicyChange);
    return () => {
      disposed = true;
      clearScheduled();
      window.removeEventListener("load", schedule);
      reducedMotion.removeEventListener("change", onPolicyChange);
      connection?.removeEventListener("change", onPolicyChange);
    };
  }, [desktopSrc, mobileSrc]);

  useEffect(() => {
    const section = wrapperRef.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(
      entries => setInView(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    const syncPlayback = () => {
      if (userPaused || !inView || document.hidden) video.pause();
      else void video.play().catch(() => setReady(false));
    };
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => document.removeEventListener("visibilitychange", syncPlayback);
  }, [source, userPaused, inView]);

  return (
    <>
      <div
        ref={wrapperRef}
        className="hero-video-background"
        aria-hidden="true"
      >
        <img
          src={poster}
          alt=""
          decoding="async"
          fetchPriority="low"
          className="hero-video-media"
        />
        <video
          ref={videoRef}
          data-hero-background-video
          src={source}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          onPlaying={() => setReady(true)}
          onError={() => {
            setReady(false);
            setSource(undefined);
          }}
          className={`hero-video-media hero-video-motion ${ready ? "is-ready" : ""}`}
        />
        <div className="hero-video-wash" />
      </div>
      {source && ready && (
        <button
          type="button"
          onClick={() => setUserPaused(paused => !paused)}
          aria-label={
            userPaused ? "Play background video" : "Pause background video"
          }
          aria-pressed={userPaused}
          className="absolute bottom-3 right-4 z-20 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-plum/15 bg-white/90 px-3 py-2 text-[10px] font-semibold text-plum shadow-sm sm:bottom-4 sm:right-6"
        >
          {userPaused ? (
            <Play className="h-3 w-3" />
          ) : (
            <Pause className="h-3 w-3" />
          )}
          {userPaused ? "Play background" : "Pause background"}
        </button>
      )}
    </>
  );
}
