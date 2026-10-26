import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import {
  formatWeeklyPromotionDeadline,
  getWeeklyPromotionDeadline,
} from "@/lib/promotionTime";

export default function WeeklyPromotionCountdown() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const deadline = getWeeklyPromotionDeadline(now);
  const remaining = Math.max(
    0,
    Math.ceil((deadline.getTime() - now.getTime()) / 1000)
  );
  const units = [
    [Math.floor(remaining / 86400), "Days"],
    [Math.floor((remaining % 86400) / 3600), "Hours"],
    [Math.floor((remaining % 3600) / 60), "Minutes"],
    [remaining % 60, "Seconds"],
  ] as const;

  return (
    <div
      data-weekly-promotion-countdown
      data-deadline={deadline.toISOString()}
      className="mt-5 overflow-hidden rounded-2xl border border-amber/70 bg-plum p-4 text-white sm:mt-6 sm:p-5"
    >
      <p className="flex items-center gap-2 text-xs font-bold text-amber sm:text-sm">
        <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
        This week’s offer ends in
      </p>
      <div
        role="timer"
        aria-live="off"
        aria-label={`${units.map(([value, label]) => `${value} ${label.toLowerCase()}`).join(", ")} remaining in this week’s promotion`}
        className="mt-3 grid grid-cols-4 gap-2 sm:gap-3"
      >
        {units.map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/[0.08] px-1 py-2 text-center sm:py-3"
          >
            <span
              data-countdown-unit={label.toLowerCase()}
              className="block font-display text-2xl font-bold leading-none tabular-nums sm:text-3xl"
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[0.08em] text-white/70 sm:text-[9px]">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-4 text-white/75 sm:text-xs">
        Ends {formatWeeklyPromotionDeadline(deadline)}.
      </p>
    </div>
  );
}
