import { claimAchievementRewardSchema } from '$lib/schemas/claimAchievementRewardSchema.js';
import { redeemRewardSchema } from '$lib/schemas/redeemRewardSchema.js';
import type { ApiUserAchivements } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies }) {
	const achievementsDataPromise = getSafeResult(
		fetchAuthorizedApi<ApiUserAchivements>(cookies, '/api/gamification/achievements/all', 'GET'),
		null
	);

	const form = await superValidate(zod4(redeemRewardSchema));

	return { achievementsDataPromise, form };
}

export const actions = {
	claimReward: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(claimAchievementRewardSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/gamification/achievements/${formData.id}/claim`,
			'POST'
		);

		const toastData = getToastData(
			responseBody,
			'Nhận thưởng thành công!',
			'Không thể nhận thưởng.'
		);

		if (response.ok) {
			return message(form, { toastData: toastData });
		} else {
			return message(form, { toastData: toastData }, { status: 400 });
		}
	}
};
