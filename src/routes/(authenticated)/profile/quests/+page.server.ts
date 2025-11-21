import { questClaimSchema } from '$lib/schemas/questClaimSchema';
import type { GamificationProfile } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies }) {
	const gamificationProfilePromise = getSafeResult(
		fetchAuthorizedApi<GamificationProfile>(cookies, '/api/gamification/profile', 'GET'),
		null
	);

	const form = await superValidate(zod4(questClaimSchema));

	return { gamificationProfilePromise, form };
}

export const actions = {
	claimReward: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(questClaimSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/gamification/quests/${formData.userQuestId}/claim`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Nhận phần thưởng nhiệm vụ thành công!');

		if (response.ok) {
			return message(form, { toastData: toastData });
		} else {
			return message(form, { toastData: toastData }, { status: 400 });
		}
	}
};
