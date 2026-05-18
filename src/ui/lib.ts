// @file: Shared UI utility functions — time formatting, urgency calculation, CSS class composition.
// @consumers: infra-ui primitives, components
// @tasks: TSK-06

/** @purpose Urgency tier mapped from the percentage of remaining time. */
export type UrgencyVariant = 'calm' | 'moderate' | 'warning' | 'urgent';

/** @purpose Valid argument type accepted by classNames — strings or falsy values are filtered out. */
type ClassNameArg = string | false | null | undefined | 0 | '';

/**
 * @purpose Convert total minutes into a compact Russian hours+minutes string.
 * @param totalMinutes Accumulated minutes to format.
 * @returns Readable duration like "2ч 14м".
 */
export function formatTime(totalMinutes: number): string {
  const safe = Math.max(0, Math.trunc(totalMinutes));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}ч ${m}м`;
}

/**
 * @purpose Calculate remaining-time percentage for deadline-driven urgency.
 * @param remainingMs Milliseconds left until the deadline.
 * @param totalMs Total duration in milliseconds (deadline − start).
 * @throws {Error} When totalMs is zero or negative.
 * @returns Integer percentage 0–100 (clamped).
 */
export function calcUrgency(remainingMs: number, totalMs: number): number {
  if (totalMs <= 0) {
    throw new Error('[calcUrgency] totalMs must be positive');
  }
  const raw = (remainingMs / totalMs) * 100;
  return Math.max(0, Math.min(100, Math.trunc(raw)));
}

/**
 * @purpose Map a remaining-time percentage to the corresponding urgency display variant.
 * @param percentage Integer 0–100 from calcUrgency.
 * @returns One of 'calm', 'moderate', 'warning', 'urgent'.
 */
export function mapUrgencyToVariant(percentage: number): UrgencyVariant {
  if (percentage > 50) return 'calm';
  if (percentage > 25) return 'moderate';
  if (percentage > 10) return 'warning';
  return 'urgent';
}

/**
 * @purpose Conditionally join CSS class names, filtering out falsy values.
 * @param classes Varargs of class-name strings or falsy placeholders.
 * @returns Space-separated class string, or empty string when all args are falsy.
 */
export function classNames(...classes: ClassNameArg[]): string {
  return classes.filter(Boolean).join(' ');
}
