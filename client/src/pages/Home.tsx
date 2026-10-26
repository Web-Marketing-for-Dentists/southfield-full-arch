import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Info,
  MapPin,
  Menu,
  Minus,
  Navigation,
  Pause,
  Phone,
  Play,
  Quote,
  Smile,
  Star,
  TriangleAlert,
  Utensils,
  X,
} from "lucide-react";
import { Link } from "wouter";
import WeeklyPromotionCountdown from "@/components/WeeklyPromotionCountdown";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import CountUpNumber from "@/components/CountUpNumber";
import AppointmentRequestPopup, {
  AppointmentPopupTrigger,
} from "@/components/AppointmentRequestPopup";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/phone";

const DIRECTIONS_URL = "https://maps.app.goo.gl/ATaUCHHLT3gZgNn9A";
const heroSummary =
  "Replace missing or failing teeth with one complete upper or lower arch.";
const OFFICE_HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 8, close: 17 },
  2: { open: 9, close: 19 },
  3: { open: 9, close: 19 },
  4: { open: 8, close: 17 },
  5: { open: 8, close: 14 },
  6: { open: 8, close: 14 },
};
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function trackEvent(
  event: string,
  properties: Record<string, string | number | boolean> = {}
) {
  const analyticsWindow = window as Window & {
    umami?: {
      track: (
        name: string,
        data?: Record<string, string | number | boolean>
      ) => void;
    };
  };
  analyticsWindow.umami?.track(event, properties);
  window.dispatchEvent(
    new CustomEvent("southfield:analytics", {
      detail: { event, ...properties },
    })
  );
}

const pmmaIncluded = [
  "Consultation, second opinion and clear treatment planning",
  "Fixed PMMA acrylic teeth on treatment day",
  "Full-arch implant placement and removal of the teeth being replaced",
  "Any grafting included in your treatment plan",
  "All follow-up appointments through final delivery",
  "Final-fit adjustments and home-care guidance",
];

const zirconiaIncluded = [
  ...pmmaIncluded,
  "Final permanent zirconia bridge — a smooth ceramic restoration",
  "Lifetime zirconia bridge warranty with prescribed maintenance*",
];

const pricePositions = [
  {
    label: "Southfield PMMA option",
    price: "$14,990",
    suffix: "per arch",
    detail:
      "Fixed acrylic teeth made from PMMA, a lighter material that is easier to adjust and repair, but more likely to wear and stain over time.",
    tone: "neutral",
  },
  {
    label: "Southfield complete offer",
    price: "$17,990",
    suffix: "per arch",
    detail:
      "For $3,000 more per arch, receive PMMA teeth during healing and then a final zirconia bridge. It's a stronger, smoother ceramic backed by a lifetime warranty with prescribed maintenance.*",
    tone: "featured",
  },
  {
    label: "Premium-market range",
    price: "$25K–$30K",
    suffix: "often quoted per arch",
    detail:
      "A common premium-market range for a final full-arch restoration. Ask whether the quoted final teeth are PMMA acrylic or zirconia.",
    tone: "neutral",
  },
];

const comparisonQuestions = [
  [
    "What is the final restoration?",
    "We tell you before treatment: PMMA at $15k, zirconia at $18k",
    "Ask what material you finish with",
  ],
  [
    "Is there a lower-price option?",
    "Yes, $14,990, and we explain the tradeoff",
    "Ask what the lower price leaves out",
  ],
  [
    "What care is included?",
    "Implants, planned tooth removal and grafting",
    "Imaging, tooth removal, grafting",
  ],
  [
    "What happens on treatment day?",
    "Fixed PMMA acrylic teeth",
    "Fixed or removable teeth?",
  ],
  [
    "Is sedation included?",
    "IV sedation is optional and separate",
    "Type, provider, and total cost",
  ],
  [
    "What follow-up is included?",
    "Care through final delivery",
    "Visits, adjustments, maintenance",
  ],
  [
    "What is the zirconia price difference?",
    "+$3,000 per arch",
    "Is final zirconia included or an upgrade?",
  ],
  [
    "How is final zirconia protected?",
    "Lifetime bridge warranty with prescribed maintenance*",
    "Ask for the written material warranty",
  ],
];

const resultCases = [
  {
    image: "/images/southfield-full-arch-case-1_0f9f171d.webp",
    alt: "Southfield patient portrait and smile before and after dental treatment",
  },
  {
    image: "/images/southfield-full-arch-case-2_13cc51c7.webp",
    alt: "Southfield patient facial profile and teeth before and after dental treatment",
  },
  {
    image: "/images/southfield-full-arch-case-3_850effdd.webp",
    alt: "Southfield patient portrait and full smile before and after dental treatment",
  },
  {
    image: "/images/southfield-full-arch-case-4_16f755ac.webp",
    alt: "Southfield patient portrait, profile and smile before and after dental treatment",
  },
  {
    image: "/images/southfield-full-arch-case-5_14ccd66b.webp",
    alt: "Southfield patient portrait and teeth before and after dental treatment",
  },
];

type PatientReview = {
  id: string;
  name: string;
  label: string;
  quote: string;
  excerpt?: string;
};

const reviewProof: PatientReview[] = [
  {
    id: "daphne",
    name: "Daphne Logan",
    label: "Implant patient story published by Southfield",
    quote:
      "The dentist was incredibly friendly and knowledgeable, making sure I was comfortable throughout the entire process. My new implants look and feel great, and I couldn’t be happier with the results.",
    excerpt:
      "My new implants look and feel great, and I couldn’t be happier with the results.",
  },
  {
    id: "latonya",
    name: "LaTonya Person",
    label: "Implant patient story published by Southfield",
    quote:
      "The staff addressed all my concerns and ensured I was pain-free throughout the procedure. The implants have significantly improved my quality of life.",
    excerpt: "The implants have significantly improved my quality of life.",
  },
  {
    id: "lasandra",
    name: "LaSandra Reed",
    label: "5-star Google review · names Dr. Oleg",
    quote:
      "I needed work done on my mouth so I could have a beautiful smile at all times.",
  },
];

// Smile/award figures: client-approved Dr.OlegBillboardStats.docx.
// Implant-placement count: supplied by Alex in this task on October 26, 2026.
// Update this single list when the practice supplies revised, dated figures.
const doctorAuthorityStats = [
  {
    value: "26+",
    label: "Years creating smile makeovers",
    detail: "Smile-design experience",
  },
  { value: "1,000+", label: "Implants placed", detail: "" },
  {
    value: "2×",
    label: "Top Dentist recognitions",
    detail: "Hour Detroit magazine · 2024 & 2025",
  },
];

const faqs = [
  [
    "What’s included in the $14,990 offer?",
    "The per-arch offer includes consultation and clear treatment planning, full-arch implant placement, removal of the teeth being replaced, grafting in your plan, fixed PMMA acrylic teeth on treatment day, follow-up appointments through final delivery, final-fit adjustments, and home-care guidance. IV sedation is optional and quoted separately. A final zirconia bridge is available for $3,000 more per arch.",
  ],
  [
    "What are Southfield’s two full-arch options?",
    "The $14,990 option finishes with fixed PMMA acrylic teeth. For $3,000 more per arch, the $17,990 option includes PMMA teeth during healing and then a final permanent zirconia bridge.",
  ],
  [
    "Can I start with PMMA and move to zirconia later?",
    "Southfield describes the current material difference as $3,000 per arch. The team will explain the timing and treatment steps for moving from PMMA to final zirconia before you choose an option.",
  ],
  [
    "Is zirconia worth $3,000 more?",
    "The $3,000 difference changes the teeth you finish with. Zirconia is stronger than PMMA acrylic, easier to keep clean, and better at resisting chips, stains, and odor. PMMA costs less and is easier to repair. The better choice depends on which tradeoffs matter most to you.",
  ],
  [
    "Will I need to replace PMMA teeth?",
    "PMMA can serve patients well, but acrylic teeth can wear, dull, stain, chip, or need repair or replacement over time. The timing and cost vary, so Southfield should provide its current repair and remake pricing before you choose.",
  ],
  [
    "Can I bring another clinic’s quote?",
    "Yes. Bring the complete treatment plan or quote. Southfield can compare the final material, planned procedures, sedation, follow-up, and written total apples to apples.",
  ],
  [
    "I’m nervous about treatment. What comfort options can we discuss?",
    "Tell the Southfield team what worries you. They can talk through the treatment steps and available comfort options with you. IV sedation is available as an optional, separately quoted service; ask about the provider and total cost at your consultation.",
  ],
  [
    "Another clinic said implants could be difficult for me. Can I get a second opinion?",
    "Yes. Bring any existing scans, records, or treatment plan to your free consultation. Southfield can discuss your situation and explain which next steps may make sense after reviewing your history. No one needs to make a treatment decision on the spot.",
  ],
  [
    "What if I need both upper and lower arches?",
    "The $14,990 PMMA and $17,990 zirconia offers are shown per arch. If you’re considering both, the team can walk you through a complete treatment plan and total that covers your planned care, final material, and any optional IV sedation.",
  ],
  [
    "What is PMMA in everyday language?",
    "PMMA is a strong dental acrylic. It is lighter, costs less, and can be adjusted or repaired more easily. It can also wear, dull, stain, and hold odor more readily than zirconia over time.",
  ],
  [
    "What makes zirconia different?",
    "Zirconia is a strong, smooth dental ceramic used for the final bridge. It holds its color and surface finish better, resists stains and odor, and typically needs less maintenance than acrylic. It is not unbreakable, and a damaged zirconia bridge generally must be remade rather than repaired chairside.",
  ],
  [
    "What does the lifetime zirconia warranty include?",
    "Southfield offers a lifetime warranty on the final zirconia bridge when the prescribed maintenance schedule and written warranty conditions are followed. Review the written coverage, exclusions, maintenance requirements, and claim process before treatment.",
  ],
  [
    "Does Teeth in a Day mean my final zirconia teeth are delivered the same day?",
    "Teeth in a Day means fixed PMMA acrylic teeth are provided on treatment day. With the $17,990 zirconia option, your final ceramic bridge is delivered after healing.",
  ],
  [
    "What is included in the $17,990 per-arch offer?",
    "The offer includes consultation and treatment planning, implant placement, removal of the teeth being replaced, grafting included in the plan, fixed PMMA teeth during healing, follow-up care, the final permanent zirconia bridge, and its lifetime warranty with prescribed maintenance. IV sedation is optional and separate.",
  ],
  [
    "Is IV sedation included?",
    "No. IV sedation is optional and quoted separately before treatment. Your consultation is the right time to discuss comfort options and the provider involved.",
  ],
  [
    "Are tooth removal and grafting included?",
    "Yes. Both the $14,990 PMMA and $17,990 zirconia options include the tooth removal and grafting in your full-arch treatment plan. Everything is reviewed with you before treatment begins.",
  ],
  [
    "Are financing options available?",
    "Yes. A verified Proceed Finance example for a $10,000 loan is 72 monthly payments of $206.01 at 13.99% APR. This is an example, not a promise of approval or the terms you will receive. Your rate, term, amount financed, and payment depend on your application and lender approval.",
  ],
  [
    "Do you work with dental insurance?",
    "Southfield is in network with Delta Dental, Cigna, and HAP, and the team also files out-of-network claims for patients. Full-arch and implant benefits vary by plan, so the office will verify your specific coverage and explain what may apply.",
  ],
];

function Logo() {
  return (
    <a
      href="#top"
      className="flex shrink-0 items-center gap-3"
      aria-label="Southfield Family Dental Center home"
    >
      <span className="logo-shell max-sm:p-0">
        <img
          src="/images/logo_849d8385.png"
          alt="Southfield Family Dental Center"
          className="h-[30px] w-auto min-[375px]:h-[34px] sm:h-[43px]"
        />
      </span>
      <span className="hidden border-l border-plum/15 pl-3 text-[10px] font-bold uppercase leading-[1.3] tracking-[0.19em] text-plum/72 sm:block">
        Full Arch
        <br />
        Center
      </span>
    </a>
  );
}

function Kicker({
  children,
  tone = "orchid",
}: {
  children: React.ReactNode;
  tone?: "orchid" | "amber" | "muted";
}) {
  const color =
    tone === "amber"
      ? "text-amber"
      : tone === "muted"
        ? "text-ink/45"
        : "text-orchid";
  return <p className={`eyebrow ${color}`}>{children}</p>;
}

function SectionTitle({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <h2
      className={`font-display text-[clamp(2.45rem,4.8vw,4.45rem)] leading-[0.98] tracking-[-0.045em] ${light ? "text-white" : "text-ink"}`}
    >
      {children}
    </h2>
  );
}

function GoogleReviewBadge({
  compact = false,
  large = false,
}: {
  compact?: boolean;
  large?: boolean;
  placement?: string;
}) {
  const shellClass = large
    ? "w-full flex-col !items-start gap-4 rounded-[1.75rem] px-6 py-5 sm:flex-row sm:!items-center sm:gap-6 sm:px-8 sm:py-6"
    : compact
      ? "gap-3 rounded-2xl px-3.5 py-2.5"
      : "gap-3 rounded-2xl px-4 py-3";
  const logoClass = large ? "w-28 sm:w-36" : compact ? "w-[68px]" : "w-20";

  return (
    <div
      role="group"
      aria-label="Southfield Family Dental Center Google rating: 4.7 from 2,589 reviews as of September 2026"
      className={`inline-flex items-center border border-plum/12 bg-white text-ink shadow-[0_18px_50px_rgba(53,17,61,0.1)] ${shellClass}`}
    >
      <span
        className={`shrink-0 border-plum/10 ${large ? "sm:border-r sm:pr-4" : "border-r pr-3 sm:pr-4"}`}
      >
        <img
          src="/images/google-wordmark-supplied_00e6483a.webp"
          alt="Google"
          width={696}
          height={244}
          className={`${logoClass} h-auto object-contain`}
        />
      </span>
      <span>
        {large && (
          <span className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink/48 sm:text-xs">
            Southfield Family Dental Center
          </span>
        )}
        <span className={`flex items-center ${large ? "gap-3" : "gap-2"}`}>
          <strong
            className={
              large
                ? "font-display text-4xl font-bold leading-none text-plum sm:text-5xl"
                : compact
                  ? "text-sm"
                  : "text-base"
            }
          >
            4.7
          </strong>
          <span
            className="relative inline-flex"
            aria-label="4.7 out of 5 stars"
          >
            <span className="flex text-ink/15" aria-hidden="true">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`${large ? "h-4 w-4 sm:h-6 sm:w-6" : "h-3 w-3"} fill-current`}
                />
              ))}
            </span>
            <span
              className="absolute inset-y-0 left-0 flex w-[94%] overflow-hidden text-[#f4a321]"
              aria-hidden="true"
            >
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`${large ? "h-4 w-4 sm:h-6 sm:w-6" : "h-3 w-3"} shrink-0 fill-current`}
                />
              ))}
            </span>
          </span>
        </span>
        <span
          className={`mt-1 block font-semibold leading-4 text-plum ${large ? "text-sm sm:text-base" : "text-[10px]"}`}
        >
          Verified Customer Reviews
        </span>
        <span
          className={`${large ? "mt-2 text-[10px] sm:text-sm" : "mt-0.5 text-[9px]"} block font-bold leading-4 text-ink/58`}
        >
          2,589 Google reviews · Sep 2026
        </span>
      </span>
    </div>
  );
}

function WarrantyBadge() {
  return (
    <div
      role="group"
      aria-label="Lifetime zirconia bridge warranty with prescribed maintenance; written terms apply"
      className="inline-flex items-center gap-3 rounded-2xl border border-amber/45 bg-white/[0.08] px-4 py-3 text-white"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-plum shadow-[0_8px_22px_rgba(246,162,59,0.22)]">
        <BadgeCheck className="h-6 w-6" />
      </span>
      <span>
        <strong className="block text-sm">Lifetime zirconia warranty*</strong>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.1em] text-white/52">
          Prescribed maintenance required
        </span>
      </span>
    </div>
  );
}

function ConversionActions({
  dark = false,
  compact = false,
  narrow = false,
  placement = "page",
}: {
  dark?: boolean;
  compact?: boolean;
  /** Slightly smaller primary text so the phone number fits on one line in tight columns. */
  narrow?: boolean;
  placement?: string;
}) {
  const primary = `inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.08em] transition duration-200 active:scale-[0.97] ${compact ? "min-h-11 px-5 text-[11px]" : narrow ? "min-h-13 whitespace-nowrap px-5 text-[13px] sm:px-6" : "min-h-13 px-6 text-sm sm:px-7"}`;
  const secondary = `inline-flex min-h-10 items-center justify-center gap-2 rounded-full border font-bold uppercase tracking-[0.07em] transition duration-200 active:scale-[0.97] ${compact ? "px-3.5 text-[9px]" : "px-4 text-[10px]"}`;

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <a
        href={PHONE_HREF}
        onClick={() =>
          trackEvent("call_click", {
            placement,
            office_hours_state: getOfficeCountdown().isOpen ? "open" : "closed",
          })
        }
        className={`${primary} ${dark ? "bg-amber text-plum shadow-[0_14px_34px_rgba(246,162,59,0.22)] hover:bg-white" : "bg-plum text-white shadow-[0_14px_34px_rgba(53,17,61,0.22)] hover:bg-orchid"}`}
        aria-label={`Call Southfield Family Dental at ${PHONE_DISPLAY}`}
      >
        <Phone className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />{" "}
        {PHONE_DISPLAY}
      </a>
      <AppointmentPopupTrigger
        onClick={() =>
          trackEvent("cta_click", {
            cta_type: "request_appointment",
            placement,
            destination: "appointment_popup",
          })
        }
        className={`${secondary} ${dark ? "border-white/25 bg-white/[0.06] text-white hover:bg-white/12" : "border-plum/18 bg-white text-plum hover:border-orchid/45"}`}
      >
        SCHEDULE FREE CONSULTATION{" "}
        <ArrowRight className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </AppointmentPopupTrigger>
    </div>
  );
}

function ConversionPrompt({
  title,
  note,
  placement,
}: {
  title: string;
  note: string;
  placement: string;
}) {
  return (
    <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.5rem] border border-plum/10 bg-white p-6 shadow-[0_16px_45px_rgba(53,17,61,0.06)] sm:p-7 lg:flex-row lg:items-center">
      <div className="max-w-xl">
        <p className="font-display text-2xl leading-tight text-plum sm:text-3xl">
          {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/58">{note}</p>
      </div>
      <ConversionActions placement={placement} />
    </div>
  );
}

function getDetroitDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Detroit",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value ?? 0);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    weekday: parts.find(part => part.type === "weekday")?.value ?? "Sunday",
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
  };
}

function getDetroitOffset(date: Date) {
  const parts = getDetroitDateParts(date);
  return (
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    ) - date.getTime()
  );
}

function detroitWallTimeToDate(
  year: number,
  month: number,
  day: number,
  hour: number
) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour));
  const firstPass = new Date(utcGuess.getTime() - getDetroitOffset(utcGuess));
  return new Date(utcGuess.getTime() - getDetroitOffset(firstPass));
}

function getOfficeCountdown(now = new Date()) {
  const local = getDetroitDateParts(now);
  const weekday = DAY_NAMES.indexOf(local.weekday);
  const todayHours = OFFICE_HOURS[weekday];
  const currentSeconds = local.hour * 3600 + local.minute * 60 + local.second;
  const isOpen = Boolean(
    todayHours &&
      currentSeconds >= todayHours.open * 3600 &&
      currentSeconds < todayHours.close * 3600
  );

  if (isOpen && todayHours) {
    const target = detroitWallTimeToDate(
      local.year,
      local.month,
      local.day,
      todayHours.close
    );
    return {
      isOpen: true,
      target,
      heading: "Today’s office window closes in",
      detail: `Want to speak with the team today? Call before ${todayHours.close > 12 ? todayHours.close - 12 : todayHours.close}:00 ${todayHours.close >= 12 ? "PM" : "AM"} ET. Online consultation requests remain open 24/7.`,
    };
  }

  const localDate = new Date(Date.UTC(local.year, local.month - 1, local.day));
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidateDate = new Date(localDate.getTime() + offset * 86400000);
    const candidateWeekday = candidateDate.getUTCDay();
    const candidateHours = OFFICE_HOURS[candidateWeekday];
    const isLaterToday =
      offset === 0 &&
      candidateHours &&
      currentSeconds < candidateHours.open * 3600;
    if (candidateHours && (offset > 0 || isLaterToday)) {
      const target = detroitWallTimeToDate(
        candidateDate.getUTCFullYear(),
        candidateDate.getUTCMonth() + 1,
        candidateDate.getUTCDate(),
        candidateHours.open
      );
      return {
        isOpen: false,
        target,
        heading: "The next office day starts in",
        detail: `For an urgent dental need after hours, call ${PHONE_DISPLAY} and select the emergency option. The team returns ${DAY_NAMES[candidateWeekday]} at ${candidateHours.open}:00 AM ET.`,
      };
    }
  }

  return {
    isOpen: false,
    target: now,
    heading: "Request online anytime",
    detail: `For an urgent dental need after hours, call ${PHONE_DISPLAY} and select the emergency option.`,
  };
}

function OfficeCountdown() {
  const [countdown, setCountdown] = useState(() => getOfficeCountdown());
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, countdown.target.getTime() - Date.now())
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = getOfficeCountdown();
      setCountdown(next);
      setRemaining(Math.max(0, next.target.getTime() - Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const segments = [
    [String(hours).padStart(2, "0"), "hours"],
    [String(minutes).padStart(2, "0"), "minutes"],
    [String(seconds).padStart(2, "0"), "seconds"],
  ];

  return (
    <div className="rounded-[1.6rem] border border-plum/10 bg-plum p-6 text-white shadow-[0_18px_55px_rgba(53,17,61,0.14)]">
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-amber" />
        <p className="eyebrow text-amber">
          {countdown.isOpen ? "Office open now" : "Requests open online"}
        </p>
      </div>
      <p className="mt-4 font-display text-2xl leading-tight">
        {countdown.heading}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {segments.map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/[0.07] p-3 text-center"
          >
            <p className="font-display text-3xl text-amber">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
              {label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-white/55">{countdown.detail}</p>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [caseGalleryPaused, setCaseGalleryPaused] = useState(false);
  const [caseGalleryEngaged, setCaseGalleryEngaged] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{
    name: string;
    fileId: string;
    kind?: "patient" | "team";
  } | null>(null);

  // The page renders client-side, so the browser's native jump to a URL
  // fragment (e.g. /#verified-example from an ad or email) can miss.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    document
      .getElementById(id)
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) setCaseGalleryPaused(true);
  }, []);

  useEffect(() => {
    if (caseGalleryPaused || caseGalleryEngaged) return;
    const timer = window.setInterval(() => {
      setActiveCaseIndex(current => (current + 1) % resultCases.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [caseGalleryEngaged, caseGalleryPaused]);

  return (
    <AppointmentRequestPopup
      onOpen={() => {
        setMenuOpen(false);
        setActiveVideo(null);
        trackEvent("appointment_popup_open");
      }}
      onCall={() =>
        trackEvent("call_click", { placement: "appointment_popup" })
      }
      onSchedulerOpen={() =>
        trackEvent("scheduler_open", {
          placement: "appointment_popup",
          new_window: true,
        })
      }
    >
      <div
        id="top"
        className="min-h-screen overflow-x-hidden bg-cream pb-[calc(7rem+env(safe-area-inset-bottom))] text-ink selection:bg-orchid selection:text-white sm:pb-0"
      >
        <header className="sticky top-0 z-50 border-b border-amber/70 bg-white/95 text-ink shadow-[0_8px_28px_rgba(53,17,61,0.08)] backdrop-blur-xl">
          <div className="container flex h-[78px] items-center justify-between gap-2 sm:gap-0">
            <Logo />
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Get directions to 18800 West 10 Mile Road, Southfield, MI 48075"
              onClick={() =>
                trackEvent("cta_click", {
                  cta_type: "directions",
                  placement: "mobile_header",
                  destination: "google_maps",
                })
              }
              className="flex min-h-11 flex-1 flex-col justify-center whitespace-nowrap text-center text-[11px] leading-[1.5] text-plum transition-colors hover:text-orchid min-[375px]:text-xs sm:hidden"
            >
              <span className="font-bold">18800 W 10 Mile Rd</span>
              <span className="text-ink/65">Southfield, MI 48075</span>
            </a>
            <nav
              className="hidden items-center gap-7 xl:flex"
              aria-label="Primary navigation"
            >
              <a className="nav-link" href="#consult">
                Free consult
              </a>
              <a className="nav-link" href="#options">
                Options
              </a>
              <a className="nav-link" href="#results">
                Results
              </a>
              <a className="nav-link" href="#reviews">
                Reviews
              </a>
            </nav>
            <div className="hidden xl:block">
              <ConversionActions compact placement="header" />
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center text-plum xl:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {menuOpen ? (
            <div className="max-h-[calc(100dvh-78px)] overflow-y-auto border-t border-plum/10 bg-white px-5 pb-6 pt-3 text-ink xl:hidden">
              {[
                ["Free consult", "#consult"],
                ["Options", "#options"],
                ["PMMA vs. zirconia", "#materials"],
                ["Results", "#results"],
                ["Reviews", "#reviews"],
                ["FAQs", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-plum/8 py-3 text-sm font-bold text-plum/78"
                >
                  {label}
                </a>
              ))}
              <div className="mt-5">
                <ConversionActions placement="mobile_menu" />
              </div>
            </div>
          ) : null}
        </header>

        <main>
          {/* First decision zone: clear pricing, simple timing, verified proof */}
          <section className="relative isolate overflow-hidden bg-[#f8f5ee] py-8 sm:py-14 lg:py-20">
            <HeroVideoBackground
              desktopSrc="/videos/hero-desktop-960x400_28f710b1.mp4"
              mobileSrc="/videos/hero-mobile-640x266_c2132993.mp4"
              poster="/images/hero-poster-clean_c8f4bf14.webp"
            />
            <div className="container relative grid items-start gap-7 sm:gap-12 lg:grid-cols-[1.13fr_0.87fr] lg:gap-14">
              <div className="max-w-[720px] sm:pt-3">
                <Kicker>Full-arch implants · Southfield, Michigan</Kicker>
                <h1 className="mt-3 font-display text-[clamp(2.2rem,9.4vw,2.6rem)] font-bold leading-[0.98] tracking-[-0.045em] sm:mt-5 sm:text-[clamp(2.65rem,4.5vw,4.2rem)] sm:leading-[0.96] sm:tracking-[-0.052em]">
                  <span className="block">Restore Your Confidence</span>
                  <span className="block text-plum">With Dental Implants</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/72 sm:mt-5 sm:text-lg sm:leading-8">
                  {heroSummary}
                </p>
                <div className="mt-5 rounded-[1.5rem] border border-plum/10 bg-white p-5 shadow-[0_18px_55px_rgba(53,17,61,0.08)] sm:mt-7 sm:p-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="eyebrow text-orchid">
                        Your fixed-teeth treatment package
                      </p>
                      <div className="mt-2 flex items-end gap-2 sm:gap-3">
                        <p className="font-display text-[clamp(3.1rem,6vw,5.6rem)] leading-none tracking-[-0.055em] text-plum">
                          $14,990
                        </p>
                        <p className="mb-1 whitespace-nowrap text-sm font-bold uppercase tracking-[0.1em] text-ink/48 sm:mb-2">
                          per arch
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 border-t border-plum/10 pt-4 text-sm leading-6 text-ink/66">
                    Includes implants, removal of the teeth being replaced,
                    grafting in your plan, fixed PMMA acrylic teeth on treatment
                    day, and follow-up care through final delivery.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink/66">
                    <strong className="text-plum">
                      Your treatment and price are explained before you begin.
                    </strong>{" "}
                    IV sedation is optional and quoted separately.
                  </p>
                  <p className="mt-3 rounded-xl bg-mist px-4 py-2.5 text-xs leading-5 text-plum sm:mt-4 sm:py-3">
                    <strong>
                      Choose final zirconia for $3,000 more per arch.
                    </strong>{" "}
                    Receive PMMA teeth during healing, followed by a stronger
                    ceramic bridge with a lifetime zirconia warranty, subject to
                    prescribed maintenance and written terms.
                  </p>
                  <WeeklyPromotionCountdown />
                </div>
                <div className="mt-5 sm:mt-6">
                  <ConversionActions placement="hero" />
                </div>
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <GoogleReviewBadge compact placement="hero" />
                  <a
                    href="#included"
                    onClick={() =>
                      trackEvent("cta_click", {
                        cta_type: "inclusion_details",
                        placement: "hero",
                        destination: "included",
                      })
                    }
                    className="inline-flex items-center gap-2 text-sm font-bold text-orchid"
                  >
                    See what’s included <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("video_start", {
                      story_id: "troy",
                      placement: "hero",
                    });
                    setActiveVideo({
                      name: "Troy’s patient story",
                      fileId: "1pofu2ZbnzJT8IC2l9ShAee0YawaIujBM",
                    });
                  }}
                  aria-label="Watch Troy’s patient story"
                  className="group block w-full overflow-hidden rounded-[1.6rem] border border-plum/10 bg-plum text-left shadow-[0_28px_80px_rgba(53,17,61,0.2)]"
                >
                  <img
                    data-troy-supplied-thumbnail
                    src="/images/troys-story-thumbnail-1280_a2d7c02f.webp"
                    alt="Troy’s story, Southfield implant patient: I love my new smile"
                    width={1280}
                    height={720}
                    decoding="async"
                    className="block h-auto w-full object-contain transition duration-200 group-hover:brightness-105"
                  />
                </button>
                <p className="px-1 text-[10px] leading-4 text-ink/50">
                  Individual patient experiences and results vary.
                </p>
                <div className="rounded-[1.5rem] border border-plum/10 bg-white p-6 shadow-[0_18px_50px_rgba(53,17,61,0.07)]">
                  <Kicker tone="muted">What $14,990 covers</Kicker>
                  <div className="mt-4 space-y-3">
                    {[
                      "Fixed teeth on treatment day, not a removable denture",
                      "Implants, extractions and grafting included in your plan",
                      "Follow-up care through final delivery",
                      "Every price explained before treatment begins, including optional IV sedation",
                      "Final zirconia available for $3,000 more, your choice",
                    ].map(item => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-orchid">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <p className="text-sm font-semibold leading-6 text-plum">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="team" className="section-space bg-white">
            <div className="container">
              <Kicker>Experience behind your new smile</Kicker>
              <SectionTitle>Meet Dr. Oleg Krivichkin.</SectionTitle>
              <p className="mt-4 max-w-3xl text-base leading-7 text-ink/55">
                An NYU-trained dentist, advanced smile-design training, and a
                full-mouth restoration team focused on your confidence, comfort,
                and a smile that feels like you.
              </p>
              <div className="mt-10 overflow-hidden rounded-[2rem] bg-plum text-white shadow-[0_28px_85px_rgba(53,17,61,0.18)]">
                <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[460px] overflow-hidden bg-[#2d2027] lg:min-h-[620px]">
                    <img
                      src="/images/dr-oleg-preferred_420e0c72.jpg"
                      alt="Dr. Oleg Krivichkin in his white clinical coat"
                      className="absolute inset-0 h-full w-full object-cover object-[center_16%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                      <p className="eyebrow text-amber">Meet your dentist</p>
                      <h3 className="mt-2 font-display text-4xl">
                        Dr. Oleg Krivichkin, DDS
                      </h3>
                      <p className="mt-2 text-sm font-bold text-white/68">
                        Practice partner · Full-mouth restoration team
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                    <Kicker tone="amber">
                      Advanced training. Personal care.
                    </Kicker>
                    <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,3.35rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
                      Your new smile deserves an experienced eye.
                    </h3>
                    <div className="mt-6 space-y-4 text-sm leading-7 text-white/75 sm:text-[15px]">
                      <p>
                        Dr. Oleg brings extensive cosmetic dentistry and
                        smile-makeover experience to Southfield’s full-mouth
                        restoration team. His approach considers how your new
                        teeth look, fit, and work together, not just replacing
                        missing teeth.
                      </p>
                    </div>
                    <div className="mt-6 space-y-4 border-t border-white/12 pt-6">
                      <div className="flex items-start gap-3">
                        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                        <div>
                          <p className="text-sm font-bold">
                            2 dental degrees · NYU-trained DDS
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/65">
                            Dentistry education in Moscow and a second dental
                            degree with honors from New York University.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                        <div>
                          <p className="text-sm font-bold">
                            Advanced Hornbrook smile-design training
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/65">
                            Hands-on cosmetic dentistry training focused on
                            smile design and enhancement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  data-doctor-authority-stats
                  className="grid grid-cols-3 border-t border-white/10 bg-white/[0.04]"
                >
                  {doctorAuthorityStats.map(({ value, label, detail }) => (
                    <div
                      key={label}
                      className="min-w-0 border-r border-white/10 px-2 py-5 last:border-0 sm:p-6"
                    >
                      <p className="font-display text-[clamp(1.375rem,6vw,2.5rem)] font-bold leading-none tracking-tight text-amber">
                        {value.endsWith("+") ? (
                          <CountUpNumber
                            target={Number(value.replace(/\D/g, ""))}
                            suffix="+"
                          />
                        ) : (
                          value
                        )}
                      </p>
                      <p className="mt-2 text-[11px] font-bold leading-4 text-white/90 sm:text-xs sm:leading-5">
                        {label}
                      </p>
                      {detail && (
                        <p className="mt-1 text-[10px] leading-4 text-white/65">
                          {detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-plum/10 bg-cream p-6 sm:flex-row sm:items-center">
                <div>
                  <Kicker>Patient-reviewed care</Kicker>
                  <p className="mt-2 text-sm leading-6 text-ink/68">
                    See independent patient feedback before choosing your
                    implant team.
                  </p>
                </div>
                <GoogleReviewBadge compact placement="doctor" />
              </div>
            </div>
          </section>

          <section id="reviews" className="section-space bg-white">
            <div className="container">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-14">
                <div>
                  <Kicker>Implant patient feedback</Kicker>
                  <SectionTitle>
                    Real patients. Real reasons to feel confident.
                  </SectionTitle>
                  <p className="mt-5 max-w-xl text-lg leading-8 text-ink/62">
                    Patients describe feeling heard, comfortable, and confident
                    in their results. These are the outcomes people care about
                    before making the call.
                  </p>
                </div>
                <div className="rounded-[2rem] bg-gradient-to-br from-cream via-white to-orchid/[0.08] p-3 ring-1 ring-plum/8 sm:p-4">
                  <GoogleReviewBadge large placement="implant_reviews" />
                  <p className="px-3 pb-2 pt-4 text-sm leading-6 text-ink/58 sm:px-5">
                    Thousands of patients have shared their experience with
                    Southfield Family Dental Center on Google.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-orchid lg:hidden">
                Swipe to read more patient stories →
              </p>
              <div
                className="-mr-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-5 sm:mr-0 sm:gap-5 lg:mt-10 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 lg:pr-0"
                role="region"
                aria-label="Patient review cards"
                tabIndex={0}
              >
                {reviewProof.map(review => (
                  <article
                    key={review.name}
                    id={`review-${review.id}`}
                    className="flex w-[min(82vw,350px)] shrink-0 snap-start flex-col justify-between rounded-[1.6rem] border border-plum/10 bg-cream p-6 shadow-[0_16px_45px_rgba(53,17,61,0.055)] sm:p-8 lg:min-h-[340px] lg:w-auto"
                  >
                    <div>
                      <div
                        className="flex items-center gap-1 text-[#f4a321]"
                        aria-label="Five star patient feedback"
                      >
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <Quote className="mt-7 h-7 w-7 text-orchid" />
                      <blockquote className="mt-5 font-display text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.025em] text-plum sm:text-[1.55rem]">
                        “{review.quote}”
                      </blockquote>
                    </div>
                    <div className="mt-8 border-t border-plum/10 pt-5">
                      <p className="text-sm font-bold text-ink">
                        {review.name}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/42">
                        {review.label}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-ink/42">
                Implant patient stories are quoted from Southfield’s published
                patient pages; the Google badge reflects the practice’s overall
                Google rating. Individual experiences and results vary.
              </p>
              <div className="mt-7 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] bg-plum p-6 text-white sm:flex-row sm:items-center sm:p-7">
                <div className="max-w-2xl">
                  <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl">
                    You deserve the same clarity before choosing your new smile.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/66">
                    Call Southfield for a free implant second opinion and get
                    your questions answered directly.
                  </p>
                </div>
                <ConversionActions dark compact placement="implant_reviews" />
              </div>
            </div>
          </section>

          <section id="materials" className="section-space bg-white">
            <div className="container">
              <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
                <div>
                  <Kicker>Two materials. Two different jobs.</Kicker>
                  <SectionTitle>PMMA vs. zirconia</SectionTitle>
                </div>
                <p className="max-w-2xl text-base leading-7 text-ink/58">
                  You choose the final material. PMMA acrylic finishes at
                  $14,990; a final zirconia bridge finishes at $17,990. Both
                  start the same way — fixed teeth on treatment day.
                </p>
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <article className="rounded-[1.75rem] border border-plum/10 bg-cream p-6 shadow-[0_18px_55px_rgba(53,17,61,0.06)] sm:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-orchid">$14,990 per arch</p>
                      <h3 className="mt-3 font-display text-4xl font-semibold leading-none text-plum sm:text-5xl">
                        PMMA acrylic
                      </h3>
                    </div>
                    <span className="rounded-full border border-plum/10 bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-plum">
                      Lighter + repairable
                    </span>
                  </div>
                  <p className="mt-6 text-base leading-7 text-ink/62">
                    Think of PMMA as a durable dental plastic. It is
                    lightweight, costs less, and can often be adjusted or
                    repaired more easily.
                  </p>
                  <div className="mt-5 space-y-3 border-t border-plum/10 pt-5 sm:mt-7 sm:space-y-4 sm:pt-6">
                    {[
                      ["Used for your fixed teeth on treatment day", "benefit"],
                      ["Easier to adjust as your mouth heals", "benefit"],
                      [
                        "Can wear, dull, stain, or hold odor over time",
                        "caution",
                      ],
                      ["May need repair or replacement over time", "caution"],
                      [
                        "The $14,990 option finishes with PMMA teeth",
                        "neutral",
                      ],
                      [
                        "Warranty terms for PMMA are provided in writing at your consultation",
                        "neutral",
                      ],
                    ].map(([item, kind]) => (
                      <p
                        key={item}
                        className="flex gap-3 text-sm leading-6 text-ink/62"
                      >
                        {kind === "benefit" ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orchid" />
                        ) : kind === "caution" ? (
                          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
                        ) : (
                          <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink/45" />
                        )}
                        {item}
                      </p>
                    ))}
                  </div>
                </article>

                <article className="relative overflow-hidden rounded-[1.75rem] border-2 border-amber bg-plum p-6 text-white shadow-[0_25px_75px_rgba(53,17,61,0.2)] sm:p-9">
                  <span className="absolute right-0 top-0 rounded-bl-2xl bg-amber px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-plum">
                    Final zirconia teeth
                  </span>
                  <div className="flex flex-wrap items-start justify-between gap-4 pr-20">
                    <div>
                      <p className="eyebrow text-amber">$17,990 per arch</p>
                      <h3 className="mt-3 font-display text-4xl font-semibold leading-none text-white sm:text-5xl">
                        Zirconia ceramic
                      </h3>
                    </div>
                  </div>
                  <figure className="mt-6 grid grid-cols-[112px_1fr] items-center gap-3 rounded-2xl bg-white p-3 text-plum sm:grid-cols-[164px_1fr] sm:gap-4 sm:p-4">
                    <img
                      src="/images/zirconia-implant-illustration_20e39b51.webp"
                      alt="Illustration of a full-arch zirconia bridge secured to dental implants"
                      width={336}
                      height={319}
                      loading="lazy"
                      className="h-auto w-full object-contain"
                    />
                    <figcaption>
                      <p className="text-xs font-bold leading-5 sm:text-sm">
                        Your final smile, fixed in place.
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-ink/65 sm:text-xs">
                        A zirconia bridge attaches to your implants, not a
                        removable denture.
                      </p>
                      <p className="mt-2 text-[9px] text-ink/45">
                        Treatment illustration.
                      </p>
                    </figcaption>
                  </figure>
                  <p className="mt-6 text-base leading-7 text-white/68">
                    Think of zirconia as a strong, smooth dental ceramic. It is
                    built for the final bridge and better resists everyday wear,
                    stains, and odor.
                  </p>
                  <div className="mt-6">
                    <WarrantyBadge />
                  </div>
                  <div className="mt-5 space-y-3 border-t border-white/12 pt-5 sm:mt-7 sm:space-y-4 sm:pt-6">
                    {[
                      ["Stronger for long-term chewing", "benefit"],
                      ["Smooth surface is easier to keep clean", "benefit"],
                      [
                        "Holds its color and finish better over time",
                        "benefit",
                      ],
                      [
                        "Lifetime bridge warranty with prescribed maintenance*",
                        "benefit",
                      ],
                      [
                        "If it breaks, it usually must be remade rather than repaired in the chair",
                        "caution",
                      ],
                      [
                        "The $17,990 option includes PMMA during healing, then final zirconia",
                        "neutral",
                      ],
                    ].map(([item, kind]) => (
                      <p
                        key={item}
                        className="flex gap-3 text-sm leading-6 text-white/68"
                      >
                        {kind === "benefit" ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                        ) : kind === "caution" ? (
                          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                        ) : (
                          <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/45" />
                        )}
                        {item}
                      </p>
                    ))}
                  </div>
                </article>
              </div>

              <div className="mt-6 grid gap-5 rounded-[1.5rem] border border-plum/10 bg-mist p-6 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="font-display text-xl font-semibold leading-tight text-plum sm:hidden">
                    The difference: +$3,000 per arch for final zirconia and its
                    lifetime bridge warranty with prescribed maintenance.*
                  </p>
                  <p className="hidden font-display text-2xl font-semibold leading-tight text-plum sm:block sm:text-3xl">
                    The honest difference: zirconia is $3,000 more per arch.
                    PMMA costs less and is easier to repair; zirconia is
                    stronger, easier to keep clean, keeps its appearance longer,
                    and includes a lifetime bridge warranty with prescribed
                    maintenance.*
                  </p>
                  <p className="mt-3 text-xs leading-5 text-ink/45">
                    No dental material is unbreakable. Wear, maintenance, and
                    longevity vary by patient and care habits.
                  </p>
                </div>
                <ConversionActions placement="material_comparison" />
              </div>
            </div>
          </section>

          <section id="consult" className="bg-plum py-14 text-white sm:py-16">
            <div className="container grid gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
              <div>
                <Kicker tone="amber">Free implant consultation</Kicker>
                <h2 className="mt-3 font-display text-[clamp(2.8rem,4.8vw,4.9rem)] leading-[0.95] tracking-[-0.045em]">
                  Get a free second opinion before you decide.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
                  Bring your questions or another clinic’s quote. Leave knowing
                  what’s included, which final teeth you’re choosing, and your
                  complete treatment price.
                </p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber/35 bg-amber/10 px-4 py-2 text-xs font-bold text-amber">
                  <Check className="h-4 w-4" /> No obligation to start treatment
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4 text-amber">
                  What you’ll leave knowing
                </p>
                <div className="grid gap-3 min-[375px]:grid-cols-2">
                  {[
                    [
                      "01",
                      "Your two fixed-teeth options",
                      "$14,990 PMMA acrylic or $17,990 final zirconia for one upper or lower arch.",
                    ],
                    [
                      "02",
                      "What’s included",
                      "Implants, planned tooth removal and grafting, fixed teeth and follow-up care.",
                    ],
                    [
                      "03",
                      "Your complete price",
                      "Know your treatment total and the separate cost of IV sedation if you choose it.",
                    ],
                    [
                      "04",
                      "A decision without pressure",
                      "Get your questions answered. You don’t have to start treatment to get clarity.",
                    ],
                  ].map(([number, title, detail]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 sm:p-5"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-amber/15 font-display text-sm font-bold text-amber">
                        {number}
                      </span>
                      <p className="mt-3 text-[13px] font-bold leading-snug text-white sm:text-sm">
                        {title}
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-white/68">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <ConversionActions dark placement="consult" />
                </div>
                <p className="mt-4 text-xs leading-5 text-white/55">
                  Call to talk with the team. Online consultation requests are
                  also available if you prefer to start there.
                </p>
                <figure
                  data-patient-quote="daphne"
                  className="mt-6 border-l-2 border-amber/75 bg-white/[0.045] px-4 py-4 sm:mt-7 sm:px-5"
                >
                  <Quote className="h-5 w-5 text-amber" aria-hidden="true" />
                  <blockquote className="mt-2 max-w-xl font-display text-base font-medium leading-snug text-white/90 sm:text-lg">
                    “{reviewProof[0].excerpt}”
                  </blockquote>
                  <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-white/65">
                    <strong className="text-white">Daphne Logan</strong>
                    <span>· Southfield implant patient story</span>
                    <a
                      href="#review-daphne"
                      className="font-semibold text-amber underline-offset-4 hover:underline focus-visible:underline"
                    >
                      Read full story
                    </a>
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section id="why-southfield" className="bg-cream py-16 sm:py-20">
            <div className="container">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Kicker>What this could mean for you</Kicker>
                  <SectionTitle>It’s about more than new teeth.</SectionTitle>
                </div>
                <p className="max-w-md text-sm leading-7 text-ink/60">
                  A treatment decision starts with what you want life to feel
                  like, not just a list of procedures.
                </p>
              </div>
              <div className="mt-7 grid gap-3 sm:mt-9 sm:gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Smile,
                    title: "Smile with confidence",
                    text: "Feel more at ease in photos, conversations and everyday moments.",
                  },
                  {
                    icon: Utensils,
                    title: "Enjoy meals again",
                    text: "Tell us which foods you miss and what comfortable eating would mean to you.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Know the path ahead",
                    text: "Understand the final material, treatment steps, per-arch price and optional costs.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <article
                    key={title}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-plum/10 bg-white p-5 shadow-[0_14px_42px_rgba(53,17,61,0.055)] sm:block sm:p-7"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber/15 text-orchid sm:h-12 sm:w-12">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight text-plum sm:mt-5 sm:text-xl">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-ink/62 sm:mt-2">
                        {text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-11 grid gap-6 rounded-[1.8rem] border border-plum/10 bg-white p-5 shadow-[0_20px_60px_rgba(53,17,61,0.075)] sm:p-7 lg:grid-cols-[0.76fr_1.24fr] lg:items-center lg:p-8">
                <div>
                  <Kicker>See what’s possible</Kicker>
                  <h3 className="mt-3 font-display text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-[1.07] tracking-[-0.035em] text-plum">
                    Real patients. Real Southfield results.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">
                    Preview a Southfield patient transformation, then explore
                    all five cases in the gallery below.
                  </p>
                  <a
                    href="#results"
                    onClick={() =>
                      trackEvent("cta_click", {
                        cta_type: "view_results",
                        placement: "early_proof",
                        destination: "results",
                      })
                    }
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orchid hover:text-plum"
                  >
                    Explore all five cases <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[resultCases[1], resultCases[4]].map((result, index) => (
                    <a
                      key={result.image}
                      href="#results"
                      onClick={() => {
                        const caseIndex = index === 0 ? 1 : 4;
                        setActiveCaseIndex(caseIndex);
                        trackEvent("case_view", {
                          case_number: caseIndex + 1,
                          placement: "early_proof",
                        });
                      }}
                      className={`group overflow-hidden rounded-[1.1rem] border border-plum/10 bg-cream p-1.5 transition hover:border-orchid/40 focus-visible:outline-2 focus-visible:outline-orchid ${index === 1 ? "hidden sm:block" : ""}`}
                      aria-label={`View Southfield patient case ${index === 0 ? 2 : 5} in the results gallery`}
                    >
                      <img
                        src={result.image}
                        alt={result.alt}
                        loading="lazy"
                        className="aspect-[3/2] w-full rounded-[0.8rem] object-contain transition duration-200 group-hover:scale-[1.02]"
                      />
                      <span className="block px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-plum">
                        Southfield case {index === 0 ? "02" : "05"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="process" className="section-space bg-mist">
            <div className="container">
              <Kicker>From consultation to final zirconia</Kicker>
              <SectionTitle>Our “Teeth in a Day” process.</SectionTitle>
              <p className="mt-4 max-w-3xl text-base leading-7 text-ink/58">
                Both options begin with fixed PMMA acrylic teeth on treatment
                day. With the $17,990 option, those healing teeth are followed
                by your final permanent zirconia bridge.
              </p>
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  [
                    "01",
                    "Free implant consultation",
                    "Review your smile goals, material options, treatment steps, and total price.",
                  ],
                  [
                    "02",
                    "Planned treatment day",
                    "Implants and the treatment steps included in your plan are completed.",
                  ],
                  [
                    "03",
                    "Fixed PMMA teeth that day",
                    "Leave with lightweight acrylic teeth that can be adjusted as you heal.",
                  ],
                  [
                    "04",
                    "Final zirconia delivery",
                    "With the $17,990 option, your final permanent zirconia bridge is delivered after healing.",
                  ],
                ].map(([number, title, detail]) => (
                  <article
                    key={number}
                    className="rounded-[1.5rem] border border-plum/10 bg-white p-6 shadow-[0_16px_45px_rgba(53,17,61,0.06)]"
                  >
                    <p className="font-display text-4xl text-orchid">
                      {number}
                    </p>
                    <h3 className="mt-5 font-display text-2xl leading-tight text-plum">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink/58">
                      {detail}
                    </p>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-xs leading-5 text-ink/42">
                PMMA and zirconia do different jobs: acrylic is easy to adjust
                during healing; zirconia is the stronger, smoother final
                material.
              </p>
              <p className="mt-3 max-w-4xl text-xs leading-6 text-ink/50">
                Southfield’s tools include CBCT/3D imaging, digital X-rays,
                intraoral scanning and photography, Pearl AI-assisted imaging,
                digital full-arch planning, and 3D printing. Your team can
                explain which tools are relevant to your treatment and any
                associated costs.
              </p>
            </div>
          </section>

          <section id="options" className="section-space bg-plum text-white">
            <div className="container">
              <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                <div>
                  <Kicker tone="amber">
                    Two Southfield options + premium market
                  </Kicker>
                  <SectionTitle light>
                    <span className="block">
                      Find the Right Option for You,
                    </span>
                    <span className="block">not just the lowest number.</span>
                  </SectionTitle>
                </div>
                <div className="max-w-2xl lg:justify-self-end">
                  <p className="text-base leading-7 text-white/68">
                    For $3,000 more per arch, the final material changes from
                    PMMA acrylic to zirconia. The difference is simple: the
                    teeth you finish with.
                  </p>
                  <p className="mt-3 text-xs leading-5 text-white/42">
                    Prices are per arch. The premium range is a market
                    reference, not a quote from a specific competitor. IV
                    sedation is optional.
                  </p>
                </div>
              </div>
              <div className="mt-11 grid items-stretch gap-5 lg:grid-cols-3">
                {pricePositions.map(position => {
                  const featured = position.tone === "featured";
                  return (
                    <article
                      key={position.label}
                      className={
                        featured
                          ? "relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border-2 border-amber bg-white p-6 text-ink shadow-[0_28px_85px_rgba(0,0,0,0.28)] sm:p-8 lg:min-h-[360px] lg:-translate-y-4"
                          : "flex flex-col justify-between rounded-[1.8rem] border border-white/12 bg-white/[0.055] p-6 text-white sm:p-8 lg:min-h-[330px]"
                      }
                    >
                      {featured ? (
                        <span className="absolute right-0 top-0 rounded-bl-2xl bg-amber px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-plum">
                          +$3,000 for zirconia
                        </span>
                      ) : null}
                      <div>
                        <p
                          className={`eyebrow ${featured ? "text-orchid" : "text-amber"}`}
                        >
                          {position.label}
                        </p>
                        <p
                          className={`mt-5 font-display text-[clamp(3.1rem,5vw,5.4rem)] font-bold leading-none tracking-[-0.055em] sm:mt-7 ${featured ? "text-plum" : "text-white"}`}
                        >
                          {position.price}
                        </p>
                        <p
                          className={`mt-2 text-[10px] font-bold uppercase tracking-[0.14em] ${featured ? "text-ink/42" : "text-white/42"}`}
                        >
                          {position.suffix}
                        </p>
                      </div>
                      <div
                        className={`mt-5 border-t pt-4 sm:mt-10 sm:pt-5 ${featured ? "border-plum/10" : "border-white/12"}`}
                      >
                        <p
                          className={`text-sm leading-6 ${featured ? "text-ink/64" : "text-white/58"}`}
                        >
                          {position.detail}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <figure
                data-patient-quote="latonya"
                className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border border-amber/25 bg-amber/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-6"
              >
                <Quote
                  className="h-6 w-6 shrink-0 text-amber"
                  aria-hidden="true"
                />
                <blockquote className="font-display text-lg font-medium leading-snug text-white sm:flex-1 sm:text-xl">
                  “{reviewProof[1].excerpt}”
                </blockquote>
                <figcaption className="text-xs leading-5 text-white/65 sm:max-w-[210px] sm:text-right">
                  <strong className="block text-white">LaTonya Person</strong>
                  <span>Southfield implant patient story</span>
                  <a
                    href="#review-latonya"
                    className="mt-1 block font-semibold text-amber underline-offset-4 hover:underline focus-visible:underline"
                  >
                    Read full story
                  </a>
                </figcaption>
              </figure>
              <div className="mt-4 flex flex-col items-start justify-between gap-6 rounded-[1.5rem] border border-white/12 bg-white/[0.055] p-6 sm:p-7 lg:flex-row lg:items-center">
                <div>
                  <p className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    Upgrade to final zirconia for $3,000 more per arch.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/52">
                    Compare strength, maintenance, appearance, and exactly what
                    the $15k and $18k options include.
                  </p>
                </div>
                <ConversionActions dark placement="price_positions" />
              </div>
            </div>
          </section>

          <section id="compare" className="section-space bg-cream">
            <div className="container">
              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                <div>
                  <Kicker>Compare the final plan</Kicker>
                  <SectionTitle>
                    Ask every clinic the same questions.
                  </SectionTitle>
                </div>
                <p className="max-w-2xl text-base leading-7 text-ink/58">
                  Prices look similar until you compare what’s inside them. Ask
                  any clinic the same questions you’d ask us — we’ve put our
                  answers in writing.
                </p>
              </div>
              <p className="mt-5 text-xs leading-5 text-ink/55 sm:hidden">
                Tap a question for Southfield’s answer and what to ask another
                clinic.
              </p>
              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-plum/12 bg-white shadow-[0_18px_52px_rgba(53,17,61,0.08)] sm:hidden">
                {comparisonQuestions.map(
                  ([question, southfield, ask], index) => (
                    <details
                      key={question}
                      open={index < 2}
                      className="group border-b border-plum/10 last:border-b-0"
                    >
                      <summary className="flex min-h-16 list-none items-center gap-3 px-4 py-3 marker:hidden focus-visible:outline-2 focus-visible:outline-orchid [&::-webkit-details-marker]:hidden">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream font-display text-xs font-bold text-orchid">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-display text-sm font-bold leading-snug text-plum">
                          {question}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-orchid transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className="space-y-3 px-4 pb-4">
                        <p className="rounded-xl bg-[#fff4dd] p-3 text-sm font-semibold leading-5 text-plum">
                          <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.1em] text-orchid">
                            Southfield’s answer
                          </span>
                          {southfield}
                        </p>
                        <p className="px-1 text-xs leading-5 text-ink/64">
                          <strong className="text-plum">Ask elsewhere:</strong>{" "}
                          {ask}
                        </p>
                      </div>
                    </details>
                  )
                )}
              </div>
              <div className="relative mt-10 hidden overflow-hidden rounded-[2rem] border-2 border-plum/12 bg-white shadow-[0_28px_90px_rgba(53,17,61,0.13)] sm:block">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orchid via-amber to-orchid" />
                <div className="hidden grid-cols-[1.05fr_0.95fr_0.95fr] bg-plum text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:grid">
                  <span className="px-7 py-5">Question</span>
                  <span className="flex items-center gap-2 bg-amber px-7 py-5 text-plum">
                    <BadgeCheck className="h-4 w-4" /> Southfield’s clear answer
                  </span>
                  <span className="bg-white/[0.06] px-7 py-5">
                    Ask the other clinic
                  </span>
                </div>
                {comparisonQuestions.map(
                  ([question, southfield, ask], index) => (
                    <div
                      key={question}
                      className={`grid gap-3 border-b border-plum/8 p-4 text-sm leading-6 last:border-0 sm:grid-cols-[1.05fr_0.95fr_0.95fr] sm:gap-0 sm:p-0 ${index % 2 === 0 ? "bg-white" : "bg-[#fcfaf7]"}`}
                    >
                      <div className="flex items-start gap-3 px-1 py-2 sm:items-center sm:px-7 sm:py-6">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-plum/12 bg-cream font-display text-sm font-semibold text-orchid">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong className="pt-1 font-display text-xl leading-tight text-plum sm:pt-0 sm:font-sans sm:text-sm sm:leading-6">
                          {question}
                        </strong>
                      </div>
                      <div className="rounded-2xl border border-amber/45 bg-[#fff7e8] p-4 shadow-[0_8px_24px_rgba(246,162,59,0.1)] sm:flex sm:items-center sm:rounded-none sm:border-x sm:border-y-0 sm:px-7 sm:py-6 sm:shadow-none">
                        <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.13em] text-orchid sm:hidden">
                          Southfield’s clear answer
                        </span>
                        <span className="flex items-start gap-3 font-semibold text-plum">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber text-plum">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {southfield}
                        </span>
                      </div>
                      <div className="px-1 py-2 text-ink/52 sm:flex sm:items-center sm:bg-plum/[0.025] sm:px-7 sm:py-6">
                        <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.12em] text-ink/38 sm:hidden">
                          Ask the other clinic
                        </span>
                        <span className="flex items-start gap-3">
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-orchid/65" />
                          {ask}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
              <ConversionPrompt
                title="Already holding another treatment plan?"
                note="Bring it to your free consultation. We will compare PMMA acrylic, zirconia, included care, and total price apples to apples."
                placement="comparison"
              />
            </div>
          </section>

          {/* Both advertised options show their full inclusions and optional costs. */}
          <section id="included" className="section-space bg-mist">
            <div className="container">
              <Kicker>No mystery line items</Kicker>
              <SectionTitle>What each option covers.</SectionTitle>
              <div className="mt-8 grid items-stretch gap-5 lg:mt-10 lg:grid-cols-2">
                {[
                  {
                    material: "Fixed PMMA acrylic teeth",
                    price: "$14,990",
                    items: pmmaIncluded,
                    zirconia: false,
                  },
                  {
                    material: "Final zirconia bridge",
                    price: "$17,990",
                    items: zirconiaIncluded,
                    zirconia: true,
                  },
                ].map(option => (
                  <article
                    key={option.price}
                    data-inclusion-option={
                      option.zirconia ? "zirconia" : "pmma"
                    }
                    className={`flex flex-col overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_18px_55px_rgba(53,17,61,0.07)] ${option.zirconia ? "border-amber" : "border-plum/12"}`}
                  >
                    <div
                      className={`p-6 sm:p-8 ${option.zirconia ? "bg-plum text-white" : "bg-cream text-plum"}`}
                    >
                      <p
                        className={`eyebrow ${option.zirconia ? "text-amber" : "text-orchid"}`}
                      >
                        {option.zirconia
                          ? "+$3,000 for final zirconia"
                          : "Full-arch treatment offer"}
                      </p>
                      <div className="mt-3 flex flex-wrap items-baseline gap-3">
                        <p className="font-display text-5xl font-bold leading-none tracking-[-0.045em] sm:text-6xl">
                          {option.price}
                        </p>
                        <p
                          className={`whitespace-nowrap text-sm font-bold uppercase tracking-[0.1em] ${option.zirconia ? "text-white/65" : "text-ink/55"}`}
                        >
                          per arch
                        </p>
                      </div>
                      <h3 className="mt-4 font-display text-xl font-bold leading-snug sm:text-2xl">
                        {option.material}
                      </h3>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <Kicker>Included, per arch</Kicker>
                      <ul className="mt-5 space-y-4">
                        {option.items.map((item, index) => (
                          <li
                            key={item}
                            className={`flex gap-3 text-sm leading-6 ${option.zirconia && index >= pmmaIncluded.length ? "font-semibold text-plum" : "text-ink/65"}`}
                          >
                            <span
                              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${option.zirconia && index >= pmmaIncluded.length ? "bg-amber text-plum" : "bg-mist text-orchid"}`}
                            >
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 grid gap-5 rounded-[1.5rem] border border-plum/10 bg-white p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <Kicker tone="muted">Optional, quoted separately</Kicker>
                  <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-plum sm:text-3xl">
                    IV sedation, if you choose it.
                  </h3>
                </div>
                <p className="flex gap-3 text-sm leading-7 text-ink/62">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-orchid" />
                  <span>
                    It is available here, optional, and quoted up front for
                    either option. Your consultation explains the final
                    material, included treatment, optional IV sedation, and
                    total price before treatment begins.
                  </span>
                </p>
              </div>
              <ConversionPrompt
                title="Ready to compare your two Southfield options?"
                note="See the $14,990 PMMA acrylic option and the $17,990 final-zirconia option side by side."
                placement="inclusions"
              />
            </div>
          </section>

          <section id="results" className="section-space bg-[#f1eae3]">
            <div className="container">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="max-w-4xl">
                  <Kicker>Real Southfield treatment results</Kicker>
                  <SectionTitle>
                    Before and after, without the stock-photo gloss.
                  </SectionTitle>
                </div>
                <p className="max-w-md text-sm leading-6 text-ink/62">
                  These are cases featured by Southfield’s implant program.
                  Every treatment plan and result is individual.
                </p>
              </div>
              <div
                className="mx-auto mt-10 max-w-6xl"
                onPointerEnter={() => setCaseGalleryEngaged(true)}
                onPointerLeave={() => setCaseGalleryEngaged(false)}
                onFocusCapture={() => setCaseGalleryEngaged(true)}
                onBlurCapture={event => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setCaseGalleryEngaged(false);
                  }
                }}
              >
                <figure className="overflow-hidden rounded-[2rem] border border-plum/10 bg-white p-2.5 shadow-[0_26px_75px_rgba(53,17,61,0.12)] sm:p-3">
                  <div className="relative overflow-hidden rounded-[1.55rem] bg-mist">
                    <img
                      key={resultCases[activeCaseIndex].image}
                      src={resultCases[activeCaseIndex].image}
                      alt={resultCases[activeCaseIndex].alt}
                      className="case-gallery-image aspect-[3/2] w-full object-contain"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/94 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-plum shadow-lg backdrop-blur sm:left-5 sm:top-5 sm:text-[10px]">
                      Case {String(activeCaseIndex + 1).padStart(2, "0")} of 05
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCaseGalleryPaused(currentPaused => !currentPaused)
                      }
                      aria-label={
                        caseGalleryPaused
                          ? "Resume automatic case slideshow"
                          : "Pause automatic case slideshow"
                      }
                      className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-plum/92 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] text-white shadow-lg backdrop-blur transition hover:bg-orchid active:scale-[0.97] sm:right-5 sm:top-5 sm:text-[10px]"
                    >
                      {caseGalleryPaused ? (
                        <Play className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Pause className="h-3.5 w-3.5 fill-current" />
                      )}
                      {caseGalleryPaused ? "Resume" : "Pause"}
                    </button>
                  </div>
                  <figcaption className="flex flex-col gap-1 px-3 pb-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <span className="text-sm font-bold text-plum">
                      Real Southfield patient transformation
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.13em] text-orchid"
                      aria-live="polite"
                    >
                      {caseGalleryPaused
                        ? "Autoplay paused"
                        : caseGalleryEngaged
                          ? "Pauses while you explore"
                          : "Next case in 5 seconds"}
                    </span>
                  </figcaption>
                </figure>
                <div
                  className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                  aria-label="Choose a Southfield patient case"
                >
                  {resultCases.map((result, index) => {
                    const active = activeCaseIndex === index;
                    return (
                      <button
                        key={result.image}
                        type="button"
                        aria-pressed={active}
                        aria-label={`Show Southfield case ${index + 1}`}
                        onClick={() => {
                          setActiveCaseIndex(index);
                          trackEvent("case_view", { case_number: index + 1 });
                        }}
                        className={`overflow-hidden rounded-[1.1rem] border bg-white p-1.5 text-left shadow-[0_10px_30px_rgba(53,17,61,0.06)] transition duration-200 active:scale-[0.98] ${active ? "border-orchid ring-2 ring-orchid/20" : "border-plum/10 hover:border-orchid/45"}`}
                      >
                        <img
                          src={result.image}
                          alt=""
                          className="aspect-[3/2] w-full rounded-[0.8rem] object-cover"
                        />
                        <span
                          className={`block px-2 pb-1 pt-2 text-[9px] font-extrabold uppercase tracking-[0.12em] ${active ? "text-orchid" : "text-ink/45"}`}
                        >
                          Case {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-7 flex flex-col items-start justify-between gap-5 border-t border-plum/10 pt-6 sm:flex-row sm:items-center">
                <p className="max-w-2xl text-xs leading-5 text-ink/44">
                  Photos show individual Southfield cases and are not a
                  guarantee of outcome. Treatment, healing, and results vary.
                </p>
                <AppointmentPopupTrigger
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_type: "request_appointment",
                      placement: "results",
                      destination: "appointment_popup",
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-orchid"
                >
                  Talk through your smile goals{" "}
                  <ArrowRight className="h-4 w-4" />
                </AppointmentPopupTrigger>
              </div>
            </div>
          </section>

          <section id="stories" className="section-space bg-cream">
            <div className="container">
              <div className="grid overflow-hidden rounded-[2rem] bg-plum shadow-[0_30px_90px_rgba(53,17,61,0.2)] lg:grid-cols-[1.05fr_0.95fr]">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("video_start", {
                      story_id: "mike",
                      placement: "stories",
                    });
                    setActiveVideo({
                      name: "Mike’s patient story",
                      fileId: "1ux5NyKGP17CGwkTNcRIt22KhV6IIZiL6",
                    });
                  }}
                  aria-label="Watch Mike’s patient story"
                  data-mike-video-thumbnail
                  className="group relative h-[225px] min-w-0 w-full overflow-hidden border-b border-plum/10 bg-white text-left sm:aspect-[16/10] sm:h-auto lg:aspect-auto lg:min-h-[560px] lg:border-b-0 lg:border-r"
                >
                  <img
                    src="/images/mike-interview-thumbnail_bac10697.webp"
                    alt="Mike sharing his full-mouth implant experience in his real Southfield interview"
                    loading="lazy"
                    className="absolute right-0 top-0 h-full w-[62%] object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,#fff_30%,rgba(255,255,255,0.96)_42%,rgba(255,255,255,0.55)_53%,rgba(255,255,255,0)_66%)]" />
                  <span className="absolute inset-y-0 left-0 flex w-[58%] flex-col justify-between p-4 sm:p-8 lg:p-9">
                    <span>
                      <span className="block text-[8px] font-extrabold uppercase tracking-[0.13em] text-orchid sm:text-[10px]">
                        Real patient story
                      </span>
                      <span className="mt-3 block font-display text-[clamp(1.05rem,5.9vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-plum lg:mt-7 lg:text-[2.75rem]">
                        <span className="block">A New Smile.</span>
                        <span className="block">A New Chapter.</span>
                      </span>
                      <span className="mt-3 block text-[10px] font-semibold leading-4 text-ink/65 sm:text-sm sm:leading-6 lg:mt-5">
                        Mike’s full-mouth implant experience.
                      </span>
                    </span>
                    <span className="mt-3 block">
                      <span className="mb-3 block h-0.5 w-12 bg-amber" />
                      <img
                        src="/images/logo_849d8385.png"
                        alt="Southfield Family Dental Center"
                        className="h-auto w-24 sm:w-32 lg:w-36"
                      />
                      <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold text-orchid sm:text-xs lg:mt-5">
                        Watch Mike’s story{" "}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </span>
                  <span className="absolute left-[76%] top-[74%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-plum/85 text-white shadow-[0_8px_30px_rgba(53,17,61,0.25)] transition duration-200 group-hover:scale-105 sm:h-16 sm:w-16">
                    <Play className="ml-1 h-5 w-5 fill-current sm:h-6 sm:w-6" />
                  </span>
                </button>
                <div className="flex flex-col justify-between p-8 text-white sm:p-10 lg:p-12">
                  <div>
                    <Kicker tone="amber">
                      Patient spotlight · full-mouth care
                    </Kicker>
                    <Quote className="mt-8 h-9 w-9 text-amber" />
                    <blockquote className="mt-6 font-display text-[clamp(2rem,3.4vw,3.55rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
                      “They put me at ease, they educated me, they were patient,
                      and I’m so grateful for being here. Today I’m a whole new
                      man.”
                    </blockquote>
                  </div>
                  <div className="mt-10 border-t border-white/12 pt-6">
                    <p className="font-bold">Mike</p>
                    <p className="mt-1 text-sm text-white/52">
                      Southfield full-mouth implant patient
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("video_start", {
                          story_id: "mike",
                          placement: "quote_card",
                        });
                        setActiveVideo({
                          name: "Mike’s patient story",
                          fileId: "1ux5NyKGP17CGwkTNcRIt22KhV6IIZiL6",
                        });
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber"
                    >
                      Watch Mike’s transformation{" "}
                      <CirclePlay className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <article
                data-team-video-card
                className="mt-6 grid overflow-hidden rounded-[1.75rem] border border-plum/10 bg-white shadow-[0_18px_55px_rgba(53,17,61,0.07)] md:grid-cols-[0.85fr_1.15fr]"
              >
                <button
                  type="button"
                  aria-label="Watch Anicia’s care-team introduction"
                  onClick={() => {
                    trackEvent("video_start", {
                      story_id: "anicia",
                      placement: "care_team",
                    });
                    setActiveVideo({
                      name: "Anicia | Front Desk Supervisor",
                      fileId: "1PVbWmNrnLL3DJ971GWn0rdORSGePBht0",
                      kind: "team",
                    });
                  }}
                  className="group relative block overflow-hidden bg-plum text-left"
                >
                  <img
                    src="/images/anicia-care-team_92f11514.webp"
                    alt="Anicia Jones, Southfield Family Dental’s front desk supervisor, introduces the team"
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="aspect-video h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/5" />
                  <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-plum shadow-xl transition duration-200 group-hover:scale-105">
                    <Play className="ml-1 h-5 w-5 fill-current" />
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-plum/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-amber">
                    1-minute introduction
                  </span>
                </button>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <Kicker>Meet the people behind your care</Kicker>
                  <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-plum sm:text-3xl">
                    A familiar face before your first visit.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    Meet Anicia, Southfield’s front desk supervisor. Get a feel
                    for the people you’ll meet when you call or come in to talk
                    about your smile.
                  </p>
                  <p className="mt-4 text-xs font-bold text-plum">
                    Anicia Jones · Front Desk Supervisor
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent("video_start", {
                        story_id: "anicia",
                        placement: "care_team_text",
                      });
                      setActiveVideo({
                        name: "Anicia | Front Desk Supervisor",
                        fileId: "1PVbWmNrnLL3DJ971GWn0rdORSGePBht0",
                        kind: "team",
                      });
                    }}
                    className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-orchid"
                  >
                    Meet Anicia <CirclePlay className="h-5 w-5" />
                  </button>
                </div>
              </article>
              <ConversionPrompt
                title="Ready to talk through your own smile?"
                note="Bring your questions or another clinic’s treatment plan and leave with two clear options and the full numbers."
                placement="patient_stories"
              />
              <p className="mt-5 text-xs leading-5 text-ink/42">
                Individual experiences are not guarantees. Treatment, comfort,
                recovery, and results vary.
              </p>
            </div>
          </section>

          {/* ZIP structure: financing copy left + terms card right */}
          <section id="financing" className="section-space bg-cream">
            <div className="container">
              <div
                id="verified-example"
                className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16"
              >
                <div>
                  <Kicker>Paying for it</Kicker>
                  <SectionTitle>
                    A real example, not a teaser payment.
                  </SectionTitle>
                  <p className="mt-6 text-lg leading-8 text-ink/62">
                    Southfield supplied this verified Proceed Finance example so
                    you can see the loan amount, term, APR, and payment
                    together.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-ink/52">
                    The example finances $10,000—not the complete $17,990
                    per-arch offer. Your approval, rate, term, amount financed,
                    and payment depend on your application and the lender.
                  </p>
                </div>
                <div className="overflow-hidden rounded-[1.9rem] border border-plum/10 bg-white shadow-[0_24px_70px_rgba(53,17,61,0.1)]">
                  <div className="bg-plum p-7 text-white sm:p-9">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div>
                        <Kicker tone="amber">Proceed Finance example</Kicker>
                        <p className="mt-3 font-display text-5xl font-bold leading-none sm:text-6xl">
                          $206.01
                        </p>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.13em] text-white/52">
                          per month for 72 months
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/72">
                        <BadgeCheck className="h-4 w-4 text-amber" /> Verified
                        example
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-plum/10 border-b border-plum/10 bg-white">
                    {[
                      ["$10,000", "Loan amount"],
                      ["72 months", "Term"],
                      ["13.99%", "APR"],
                    ].map(([value, label]) => (
                      <div key={label} className="p-4 text-center sm:p-6">
                        <p className="font-display text-xl font-bold text-plum sm:text-2xl">
                          {value}
                        </p>
                        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.1em] text-ink/42">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="p-6 text-xs leading-6 text-ink/48 sm:px-8">
                    Total of 72 scheduled payments: $14,832.72. Example supplied
                    by Southfield Family Dental Center for illustration only; it
                    is not an offer of credit or a guarantee of approval.
                    Additional payment or financing would be needed for costs
                    above $10,000.
                  </p>
                </div>
              </div>
              <div className="mt-10 grid gap-5 rounded-[1.75rem] border border-plum/10 bg-white p-7 shadow-[0_18px_55px_rgba(53,17,61,0.06)] sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:p-8">
                <div>
                  <Kicker>Insurance and claims support</Kicker>
                  <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-plum">
                    Help understanding what your plan may cover.
                  </h3>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {["Delta Dental", "Cigna", "HAP"].map(plan => (
                      <span
                        key={plan}
                        className="rounded-full bg-mist px-4 py-2 text-xs font-bold text-plum"
                      >
                        In network: {plan}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink/58">
                    Southfield also files out-of-network claims for patients.
                    Implant and full-arch benefits vary by plan; the office will
                    verify your specific coverage and explain what may apply.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-sm leading-6 text-ink/58">
                At $14,990, financing works the same way — your amount, rate and
                payment depend on your application.
              </p>
            </div>
          </section>

          <section id="faq" className="section-space bg-white">
            <div className="container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <Kicker>Questions worth answering first</Kicker>
                <SectionTitle>Clear answers before you commit.</SectionTitle>
                <p className="mt-5 text-base leading-7 text-ink/58">
                  These answers make the differences between PMMA acrylic teeth
                  and final zirconia easy to understand.
                </p>
                <div className="mt-7">
                  <ConversionActions narrow placement="faq_intro" />
                </div>
              </div>
              <div className="divide-y divide-plum/10 overflow-hidden rounded-[1.75rem] border border-plum/10 bg-cream shadow-[0_18px_55px_rgba(53,17,61,0.06)]">
                {faqs.map(([question, answer], index) => (
                  <details
                    key={question}
                    className="group"
                    onToggle={event => {
                      if (event.currentTarget.open)
                        trackEvent("faq_open", {
                          topic: question,
                          position: index + 1,
                        });
                    }}
                  >
                    <summary className="flex min-h-16 list-none items-center justify-between gap-5 px-6 py-5 text-left text-sm font-bold text-plum sm:px-7">
                      <span>{question}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-orchid transition duration-200 group-open:rotate-90" />
                    </summary>
                    <p className="px-6 pb-6 text-sm leading-7 text-ink/60 sm:px-7">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Final conversion section: phone first, appointment request and scheduler fallback */}
          <section id="book" className="section-space bg-mist">
            <div className="container grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              <div>
                <Kicker>Free consultation · no obligation</Kicker>
                <SectionTitle>
                  Start with a free implant second opinion.
                </SectionTitle>
                <p className="mt-5 max-w-xl text-lg leading-8 text-ink/62">
                  See what’s included in the $14,990 offer, compare the final
                  zirconia option, and understand optional IV sedation and the
                  complete price before you decide.
                </p>
                <div className="mt-8">
                  <OfficeCountdown />
                </div>
                <div className="mt-6 space-y-3 text-sm text-ink/58">
                  <p className="hidden items-center gap-3 sm:flex">
                    <Phone className="h-4 w-4 text-orchid" /> {PHONE_DISPLAY}
                  </p>
                  <p className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-orchid" /> 18800 West 10
                    Mile Road, Southfield
                  </p>
                  <p className="hidden items-center gap-3 sm:flex">
                    <Clock3 className="h-4 w-4 text-orchid" /> Monday–Saturday
                    appointments
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orchid" />
                    <span>
                      After hours, call the same number and select the emergency
                      option for urgent dental needs.
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-plum/10 bg-white p-5 shadow-[0_24px_70px_rgba(53,17,61,0.09)] sm:p-9">
                <Kicker>Free consultation · no obligation</Kicker>
                <h3 className="mt-3 font-display text-[clamp(2.3rem,4vw,3.8rem)] leading-[1] text-plum">
                  <span className="sm:hidden">
                    Call or book a free consult.
                  </span>
                  <span className="hidden sm:inline">
                    Call the team or request your free consultation online.
                  </span>
                </h3>
                <p className="mt-4 text-sm leading-6 text-ink/58 sm:mt-5 sm:leading-7">
                  Calling is the fastest way to speak with the Southfield team.
                  Prefer online? Select Schedule Free Consultation to open a
                  short appointment request form without leaving this page.
                </p>
                <div className="mt-7 hidden space-y-4 sm:block">
                  {[
                    ["01", "Ask for a free full-arch consultation"],
                    ["02", "Compare the $15k PMMA and $18k zirconia options"],
                    ["03", "Choose a consultation time that works for you"],
                  ].map(([number, text]) => (
                    <div
                      key={number}
                      className="flex items-center gap-4 border-b border-plum/8 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist font-display text-lg text-orchid">
                        {number}
                      </span>
                      <p className="text-sm font-semibold text-ink/68">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
                <a
                  href={PHONE_HREF}
                  onClick={() =>
                    trackEvent("call_click", {
                      placement: "final_booking",
                      office_hours_state: getOfficeCountdown().isOpen
                        ? "open"
                        : "closed",
                    })
                  }
                  className="button-primary mt-6 w-full sm:mt-8"
                  aria-label={`Call Southfield Family Dental at ${PHONE_DISPLAY}`}
                >
                  <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                </a>
                <AppointmentPopupTrigger
                  onClick={() =>
                    trackEvent("cta_click", {
                      cta_type: "request_appointment",
                      placement: "final_booking",
                      destination: "appointment_popup",
                    })
                  }
                  className="button-secondary mt-3 min-h-10 w-full !py-2 text-xs"
                >
                  SCHEDULE FREE CONSULTATION <ArrowRight className="h-4 w-4" />
                </AppointmentPopupTrigger>
              </div>
            </div>
          </section>

          <section id="location" className="section-space bg-cream">
            <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch lg:gap-14">
              <div className="flex flex-col justify-center">
                <Kicker>Visit Southfield Family Dental</Kicker>
                <SectionTitle>One team. One location.</SectionTitle>
                <p className="mt-5 text-lg leading-8 text-ink/62">
                  Your consultation, treatment, and follow-up care all happen at
                  our Southfield practice.
                </p>
                <div className="mt-7 space-y-4 border-y border-plum/10 py-6 text-sm leading-6 text-ink/64">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orchid" />
                    <span>
                      <strong className="block text-plum">
                        18800 West 10 Mile Road
                      </strong>
                      Southfield, MI 48075
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-orchid" />
                    <span>
                      <strong className="block text-plum">
                        Monday–Thursday
                      </strong>
                      Mon & Thu 8–5 · Tue & Wed 9–7
                      <br />
                      <strong className="mt-2 block text-plum">
                        Friday–Saturday
                      </strong>
                      8–2 · Sunday closed
                      <span className="mt-2 block text-xs text-ink/48">
                        Urgent need after hours? Call {PHONE_DISPLAY} and select
                        the emergency option.
                      </span>
                    </span>
                  </p>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent("directions_click", {
                        placement: "location_copy",
                      })
                    }
                    className="button-primary"
                  >
                    GET DIRECTIONS <Navigation className="h-4 w-4" />
                  </a>
                  <a
                    href={PHONE_HREF}
                    onClick={() =>
                      trackEvent("call_click", {
                        placement: "location",
                        office_hours_state: getOfficeCountdown().isOpen
                          ? "open"
                          : "closed",
                      })
                    }
                    className="button-secondary !border-plum/18 !text-plum"
                  >
                    <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
              <div className="overflow-hidden rounded-[1.75rem] border border-plum/10 bg-white p-2 shadow-[0_22px_70px_rgba(53,17,61,0.1)]">
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackEvent("directions_click", {
                      placement: "location_map",
                    })
                  }
                  className="group relative block h-[400px] overflow-hidden rounded-[1.35rem] bg-mist sm:h-[500px]"
                  aria-label="Open directions to Southfield Family Dental Center in Google Maps"
                >
                  <img
                    src="/images/southfield-location-map_9a5caa63.png"
                    alt="Locator map showing Southfield Family Dental Center on West 10 Mile Road near Northwestern Highway"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
                  />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/94 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-plum shadow-lg backdrop-blur">
                    <Navigation className="h-3.5 w-3.5 text-orchid" /> Open in
                    Google Maps
                  </span>
                  <span className="absolute bottom-3 right-4 rounded bg-white/80 px-2 py-1 text-[8px] text-ink/45 backdrop-blur">
                    Map data © OpenStreetMap contributors
                  </span>
                </a>
              </div>
            </div>
          </section>
        </main>

        {activeVideo ? (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#140a17]/88 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.name}
            onClick={event => {
              if (event.target === event.currentTarget) setActiveVideo(null);
            }}
          >
            <div className="w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-plum px-5 py-4 text-white">
                <div>
                  <p className="eyebrow text-amber">
                    {activeVideo.kind === "team"
                      ? "Meet your care team"
                      : "Patient testimonial"}
                  </p>
                  <p className="mt-1 font-display text-xl">
                    {activeVideo.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                  aria-label="Close testimonial video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://drive.google.com/file/d/${activeVideo.fileId}/preview`}
                  title={activeVideo.name}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : null}

        <footer className="bg-[#1c0d20] py-12 text-white">
          <div className="container grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex rounded-xl bg-white p-3">
                <img
                  src="/images/logo_849d8385.png"
                  alt="Southfield Family Dental Center"
                  className="h-[42px] w-auto"
                />
              </div>
              <p className="mt-5 max-w-3xl text-xs leading-6 text-white/42">
                Pricing is per arch. The $14,990 option finishes with fixed PMMA
                acrylic. For $3,000 more per arch, the $17,990 option includes
                PMMA during healing followed by a final permanent zirconia
                bridge after healing. IV sedation is optional and quoted
                separately. *The lifetime zirconia bridge warranty requires the
                prescribed maintenance schedule; written coverage, exclusions,
                and other terms apply. Individual results vary.
              </p>
            </div>
            <div className="text-sm leading-7 text-white/55 lg:text-right">
              <a
                href="https://www.southfieldsmile.com/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white hover:text-amber"
              >
                SouthfieldSmile.com
              </a>
              <p>18800 West 10 Mile Road</p>
              <p>Southfield, MI 48075</p>
            </div>
          </div>
          <div className="container mt-7">
            <div className="flex flex-col justify-between gap-2 border-t border-white/15 pt-4 sm:flex-row sm:items-center">
              <p className="text-xs text-white/60">
                © {new Date().getFullYear()} Southfield Family Dental Center
              </p>
              <nav
                aria-label="Footer legal links"
                className="flex flex-wrap gap-x-6 text-sm text-white/85"
              >
                <Link
                  href="/terms-of-service/"
                  className="inline-flex min-h-11 items-center hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy-policy"
                  className="inline-flex min-h-11 items-center hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                >
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>
        </footer>
        <div
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-plum/10 bg-white/95 px-4 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-12px_36px_rgba(53,17,61,0.12)] backdrop-blur-xl sm:hidden"
          role="region"
          aria-label="Call Southfield Family Dental"
        >
          <a
            href={PHONE_HREF}
            onClick={() =>
              trackEvent("call_click", {
                placement: "mobile_sticky",
                office_hours_state: getOfficeCountdown().isOpen
                  ? "open"
                  : "closed",
              })
            }
            className="flex min-h-[60px] w-full items-center gap-3 rounded-2xl bg-plum px-4 text-white shadow-[0_10px_26px_rgba(53,17,61,0.2)] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid active:scale-[0.98]"
            aria-label={`Call ${PHONE_DISPLAY}`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber text-plum">
              <Phone className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1 text-left leading-none">
              <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-white/70">
                Free consultation
              </span>
              <span className="mt-1.5 block whitespace-nowrap font-display text-[17px] font-extrabold tracking-[-0.02em]">
                {PHONE_DISPLAY}
              </span>
            </span>
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 text-amber"
              aria-hidden="true"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </AppointmentRequestPopup>
  );
}
