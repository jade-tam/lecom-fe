import type { UserRole } from '$lib/types/User';
import type { Cookies } from '@sveltejs/kit';

export function parseJwt(token: string) {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch {
		return null;
	}
}

export function storeTokens(cookies: Cookies, token: string, refreshToken: string) {
	// Store tokens securely
	cookies.set('token', token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});

	cookies.set('refreshToken', refreshToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});
}

export function clearTokens(cookies: Cookies) {
	cookies.delete('token', { path: '/' }); // change "token" to your actual cookie name
	cookies.delete('refreshToken', { path: '/' }); // change "token" to your actual cookie name
}

export function haveAuthorization(role: UserRole | UserRole[], targetRole: UserRole): boolean {
	if (typeof role === 'string') {
		return role === targetRole || role.includes(targetRole);
	}

	if (Array.isArray(role)) {
		return role.some((v) => v === targetRole || v.includes(targetRole));
	}

	return false;
}
