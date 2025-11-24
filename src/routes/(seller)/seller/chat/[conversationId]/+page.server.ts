import { chatSchema } from '$lib/schemas/chatSchema.js';
import type { ChatMessage, Conversation } from '$lib/types/Chat';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies, params }) {
	const { conversationId } = params;

	const conversationPromise = getSafeResult(
		fetchAuthorizedApi<Conversation>(cookies, `/api/chat/seller/${conversationId}`, 'GET'),
		null
	);

	const messagesPromise = getSafeResult(
		fetchAuthorizedApi<ChatMessage[]>(cookies, `/api/chat/${conversationId}/messages`, 'GET'),
		[] as ChatMessage[]
	);

	const form = await superValidate(zod4(chatSchema));

	return {
		conversationPromise,
		token: cookies.get('token'),
		messagesPromise,
		form
	};
}

export const actions = {
	sendMessage: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod4(chatSchema));

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { conversationId } = params;
		const { content, toAI } = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/chat${toAI ? '/ai' : ''}/${conversationId}/message`,
			'POST',
			{ content: content.trim() }
		);

		const toastData: ToastData = getToastData(responseBody, 'Tin nhắn đã gửi');

		return message(form, { toastData }, !response.ok ? { status: 400 } : {});
	}
};
