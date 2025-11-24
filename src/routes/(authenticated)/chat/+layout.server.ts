import type { Conversation } from '$lib/types/Chat';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export async function load({ cookies }) {
	const allConversationsPromise: Promise<Conversation[]> = getSafeResult(
		fetchAuthorizedApi<Conversation[]>(cookies, '/api/chat/user', 'GET'),
		[] as Conversation[]
	);

	return {
		allConversationsPromise
	};
}
