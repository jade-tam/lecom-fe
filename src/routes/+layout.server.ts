import { PUBLIC_API_URL } from '$env/static/public';
import { createLogger } from '$lib/server/logger.js';
import type { UserProfile } from '$lib/types/UserProfile.js';
import { clearTokens, storeTokens } from '$lib/utils/others.js';

const logger = createLogger('/+layout.server.ts');

export const load = async ({ cookies, fetch }) => {
	try {
		// 1️⃣ Get tokens from cookies
		const token = cookies.get('token');
		const refreshToken = cookies.get('refreshToken');

		logger.log('token', token);
		logger.log('refreshToken', refreshToken);

		if (!token) {
			// No token at all → not logged in
			logger.log('No token, skip fetch user profile');

			clearTokens(cookies);
			return { userProfile: null };
		}

		// 2️⃣ Try fetching user profile
		let res = await fetch(`${PUBLIC_API_URL}/api/User/profile`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		// 3️⃣ If unauthorized (expired token), try refresh
		if (res.status === 401 && refreshToken) {
			logger.log('Expired token, try refreshing token...');

			const refreshRes = await fetch(`${PUBLIC_API_URL}/api/Auth/refresh-token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken })
			});

			if (refreshRes.ok) {
				const refreshedBody = await refreshRes.json();

				storeTokens(cookies, refreshedBody.result.token, refreshedBody.result.refreshToken);

				logger.log('Refreshed, saved new tokens into cookies');

				logger.log('Fetching user profile again...');
				// Try profile again with new token
				res = await fetch(`${PUBLIC_API_URL}/api/user/profile`, {
					headers: { Authorization: `Bearer ${refreshedBody.result.token}` }
				});
			}
		}

		if (!res.ok) {
			logger.log('Failed, cant fetch user profile');

			clearTokens(cookies);
			return { userProfile: null };
		}

		const responseBody = await res.json();
		const userProfile: UserProfile = responseBody.result;

		logger.log('Fetch user profile success');

		return { userProfile };
	} catch (err) {
		logger.log('Failed to load profile:', err);

		clearTokens(cookies);
		return { userProfile: null };
	}
};
