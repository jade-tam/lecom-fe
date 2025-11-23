import type { Conversation } from '$lib/types/Chat';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export async function load({ cookies }) {
	const allConversations: Conversation[] = await getSafeResult(
		fetchAuthorizedApi<Conversation[]>(cookies, '/api/chat/user', 'GET'),
		[] as Conversation[]
	);

	return {
		allConversations
	};
}
