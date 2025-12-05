import type { CommunityPost } from '$lib/types/CommunityPost.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const communityPostsPromise = getSafeResult(
		fetchAuthorizedApi<CommunityPost[]>(cookies, `/api/community`, 'GET'),
		[] as CommunityPost[]
	);

	return {
		communityPostsPromise
	};
};
