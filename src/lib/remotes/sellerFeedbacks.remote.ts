import { getRequestEvent, query } from '$app/server';
import type { Feedback } from '$lib/types/Feedback';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const getSellerFeedbacks = query(async () => {
	const { cookies } = getRequestEvent();

	const sellerFeedbacks = await getSafeResult(
		fetchAuthorizedApi<{
			items: Feedback[];
		}>(cookies, `/api/Feedback/shop/me?pageSize=999999999`, 'GET'),
		null
	);

	return sellerFeedbacks;
});
