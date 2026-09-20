/**
 * Helpers for remembering where a user should land after signing in.
 *
 * Email login can carry the destination in the `returnTo` query param, but the
 * OAuth (Google) flow leaves the app entirely and comes back through
 * `/auth/callback`, which knows nothing about the original page. We therefore
 * stash the destination in `sessionStorage` right before handing off to the
 * provider and read it back from the callback page.
 *
 * `sessionStorage` is the right scope here: it survives the same-tab OAuth
 * round-trip but never leaks into another tab or a later browsing session.
 */

const RETURN_TO_SESSION_KEY = 'auth:returnTo';

/**
 * Only allow same-app, path-relative destinations. This rejects absolute URLs
 * and protocol-relative values such as `//evil.example`, which would otherwise
 * turn a crafted `?returnTo=` into an open redirect.
 */
export function sanitizeReturnTo(value: string | null | undefined): string | null {
	if (!value) return null;
	if (!value.startsWith('/') || value.startsWith('//')) return null;
	return value;
}

/** Build a `/login` href that sends the user back to `returnTo` afterwards. */
export function buildLoginHref(returnTo: string): string {
	return `/login?returnTo=${encodeURIComponent(returnTo)}`;
}

/**
 * Remember the post-login destination before leaving for an OAuth provider.
 * Passing `null` clears any previously stored destination so a plain sign-in
 * doesn't reuse a stale one.
 */
export function rememberReturnTo(returnTo: string | null | undefined): void {
	if (typeof window === 'undefined') return;

	try {
		const safe = sanitizeReturnTo(returnTo);
		if (safe) {
			window.sessionStorage.setItem(RETURN_TO_SESSION_KEY, safe);
		} else {
			window.sessionStorage.removeItem(RETURN_TO_SESSION_KEY);
		}
	} catch {
		// Storage can be unavailable (private mode, blocked cookies) — the
		// callback then simply falls back to its default destination.
	}
}

/**
 * Read the stored destination without clearing it, so repeated calls (for
 * example React re-running an effect) always resolve to the same value.
 * Returns `null` when nothing usable was remembered.
 */
export function readReturnTo(): string | null {
	if (typeof window === 'undefined') return null;

	try {
		return sanitizeReturnTo(window.sessionStorage.getItem(RETURN_TO_SESSION_KEY));
	} catch {
		return null;
	}
}

/** Clear the stored destination once it has been used. */
export function clearReturnTo(): void {
	if (typeof window === 'undefined') return;

	try {
		window.sessionStorage.removeItem(RETURN_TO_SESSION_KEY);
	} catch {
		// Nothing to do — see `rememberReturnTo`.
	}
}
