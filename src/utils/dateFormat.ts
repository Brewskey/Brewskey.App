// Lightweight replacements for the small subset of `moment` we used in the
// codebase: `moment(d).format('l')`, `moment(d).format('lll')`, and
// `moment(d).fromNow()`. Implemented with the standard `Intl` APIs so we don't
// pay the bundle cost of moment.

const toDate = (
  value: Date | string | number | null | undefined,
): Date | null => {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const shortDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

// Replacement for `moment(d).format('l')`.
export const formatShortDate = (
  value: Date | string | number | null | undefined,
): string => {
  const date = toDate(value);
  return date ? shortDateFormatter.format(date) : '';
};

// Replacement for `moment(d).format('lll')`.
export const formatShortDateTime = (
  value: Date | string | number | null | undefined,
): string => {
  const date = toDate(value);
  return date ? shortDateTimeFormatter.format(date) : '';
};

const RELATIVE_UNITS: {
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}[] = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
  { unit: 'second', ms: 1000 },
];

const relativeFormatter =
  typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function'
    ? new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
    : null;

// Replacement for `moment(d).fromNow()`. Picks the largest unit whose magnitude
// is >= 1 (e.g. "5 minutes ago", "2 days ago"). Falls back to a simple English
// string on environments without `Intl.RelativeTimeFormat`.
export const fromNow = (
  value: Date | string | number | null | undefined,
): string => {
  const date = toDate(value);
  if (!date) {
    return '';
  }

  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);

  const match =
    RELATIVE_UNITS.find(({ ms }) => absMs >= ms) ??
    RELATIVE_UNITS[RELATIVE_UNITS.length - 1];

  const valueInUnit = Math.round(diffMs / match.ms);
  if (relativeFormatter) {
    return relativeFormatter.format(valueInUnit, match.unit);
  }
  const abs = Math.abs(valueInUnit);
  const label = `${abs} ${match.unit}${abs === 1 ? '' : 's'}`;
  return valueInUnit <= 0 ? `${label} ago` : `in ${label}`;
};
