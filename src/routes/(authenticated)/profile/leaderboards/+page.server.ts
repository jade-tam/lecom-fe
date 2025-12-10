import type { Leaderboard } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi.js';

export function load({ cookies }) {
	const leaderboardPromise = getSafeResult(
		fetchAuthorizedApi<Leaderboard>(cookies, '/api/gamification/leaderboard', 'GET'),
		null
	);

	return { leaderboardPromise: leaderboardPromise };
}
