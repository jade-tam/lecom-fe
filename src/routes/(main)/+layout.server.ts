// +page.server.ts

import { PUBLIC_API_URL } from '$env/static/public';
import type { UserProfile } from '$lib/types/UserProfile.js';
import { storeTokens } from '$lib/utils/others.js';

export const load = async ({ cookies, fetch }) => {
	try {
		// 1️⃣ Get tokens from cookies
		const token = cookies.get('token');
		const refreshToken = cookies.get('refreshToken');

		if (!token) {
			// No token at all → not logged in
			return { userProfile: null };
		}

		// 2️⃣ Try fetching user profile
		let res = await fetch(`${PUBLIC_API_URL}/api/User/profile`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		// 3️⃣ If unauthorized (expired token), try refresh
		if (res.status === 401 && refreshToken) {
			const refreshRes = await fetch(`${PUBLIC_API_URL}/api/Auth/refresh-token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken })
			});

			if (refreshRes.ok) {
				const refreshedBody = await refreshRes.json();

				storeTokens(cookies, refreshedBody.result.token, refreshedBody.result.refreshToken);

				// Try profile again with new token
				res = await fetch(`${PUBLIC_API_URL}/api/user/profile`, {
					headers: { Authorization: `Bearer ${refreshedBody.result.token}` }
				});
			}
		}

		if (!res.ok) {
			// Any failure → just return null
			return { userProfile: null };
		}

		const responseBody = await res.json();
		const userProfile: UserProfile = responseBody.result;

		return { userProfile };
	} catch (err) {
		console.error('Failed to load profile:', err);

		return { userProfile: null };
	}
};
