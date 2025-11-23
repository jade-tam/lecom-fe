import { resolve } from '$app/paths';
import type { Conversation } from '$lib/types/Chat.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const parentData = await parent();
	const allConversations: Conversation[] = parentData.allConversations;
	const latestConversation: Conversation | null = allConversations.length
		? allConversations[0]
		: null;

	throw redirect(
		307,
		resolve(`/(seller)/seller/chat/[conversationId]`, {
			conversationId: latestConversation ? latestConversation.id : 'no-message'
		})
	);
}
