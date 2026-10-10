/**
 * Shared input validation helpers.
 *
 * These back up the client-side form checks: the browser's `type="email"`
 * hints the keyboard and skips obviously malformed values, but it does not
 * stop a form from being submitted (and does nothing for programmatic
 * submits), so callers should still validate before hitting the API.
 */

/**
 * Pragmatic email check: a non-empty local part, an `@`, and a dotted domain,
 * with no whitespace anywhere. Deliberately permissive — the goal is to catch
 * typos and empty/garbage input, not to enforce the full RFC 5322 grammar.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Whether `value` looks like a plausible email address. */
export function isValidEmail(value: string): boolean {
	return EMAIL_PATTERN.test(value.trim());
}
