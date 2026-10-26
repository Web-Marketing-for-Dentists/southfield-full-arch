const EASTERN_TIME_ZONE = "America/Detroit";

const easternPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: EASTERN_TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

function easternWallTimestamp(date: Date) {
  const parts = easternPartsFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value ?? 0);
  return Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour"),
    value("minute"),
    value("second")
  );
}

function wallTimestampToInstant(timestamp: number) {
  let instant = timestamp;
  // Recompute the offset at the target date, including any DST change.
  for (let pass = 0; pass < 3; pass += 1) {
    const correction = timestamp - easternWallTimestamp(new Date(instant));
    if (correction === 0) break;
    instant += correction;
  }
  return new Date(instant);
}

/** The next Sunday at 23:59:00 Eastern, shared by all visitors. */
export function getWeeklyPromotionDeadline(now = new Date()) {
  const local = new Date(easternWallTimestamp(now));
  const daysToSunday = (7 - local.getUTCDay()) % 7;
  let sundayWall = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() + daysToSunday,
    23,
    59
  );
  let deadline = wallTimestampToInstant(sundayWall);
  if (deadline.getTime() <= now.getTime()) {
    sundayWall += 7 * 24 * 60 * 60 * 1000;
    deadline = wallTimestampToInstant(sundayWall);
  }
  return deadline;
}

export function formatWeeklyPromotionDeadline(deadline: Date) {
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(deadline);
  return `${date} at 11:59 PM Eastern`;
}
