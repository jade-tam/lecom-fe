import type { GamificationProfile } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi.js';

export function load({ cookies }) {
	const gamificationProfilePromise = getSafeResult(
		fetchAuthorizedApi<GamificationProfile>(cookies, '/api/gamification/profile', 'GET'),
		null
	);

	return { gamificationProfilePromise };
}
