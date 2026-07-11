/**
 * Extracts the day/month/year portion (YYYY-MM-DD) from a date string,
 * discarding any time component. Handles ISO ("2024-05-12T16:00:00"),
 * space-separated ("2024-05-12 16:00:00 UTC") and plain-date inputs.
 */
export function formatDateOnly(dateStr: string | undefined | null): string {
  if (!dateStr) return ''
  return dateStr.split(/[T ]/)[0] ?? ''
}
