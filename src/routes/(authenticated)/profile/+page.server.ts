import type { ApiRecentAchievements, GamificationProfile } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi.js';

export function load({ cookies }) {
	const gamificationProfilePromise = getSafeResult(
		fetchAuthorizedApi<GamificationProfile>(cookies, '/api/gamification/profile', 'GET'),
		null
	);

	const recentAchievementsDataPromise = getSafeResult(
		fetchAuthorizedApi<ApiRecentAchievements>(
			cookies,
			'/api/gamification/achievements/recent',
			'GET'
		),
		null
	);

	return { gamificationProfilePromise, recentAchievementsDataPromise };
}
