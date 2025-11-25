import { redeemRewardSchema } from '$lib/schemas/redeemRewardSchema.js';
import type { ApiGamificationRewards, GamificationProfile } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies }) {
	const rewardStoreDataPromise = getSafeResult(
		fetchAuthorizedApi<ApiGamificationRewards>(cookies, '/api/gamification/rewards', 'GET'),
		{
			boosters: [],
			vouchers: []
		} as ApiGamificationRewards
	);

	const gamificationProfilePromise = getSafeResult(
		fetchAuthorizedApi<GamificationProfile>(cookies, '/api/gamification/profile', 'GET'),
		null
	);

	const form = await superValidate(zod4(redeemRewardSchema));

	return { rewardStoreDataPromise, gamificationProfilePromise, form };
}

export const actions = {
	redeemReward: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(redeemRewardSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/gamification/redeem`,
			'POST',
			formData
		);

		const toastData = getToastData(
			responseBody,
			'Đổi phần thưởng thành công!',
			'Đổi phần thưởng thất bại!'
		);

		if (response.ok) {
			return message(form, { toastData: toastData });
		} else {
			return message(form, { toastData: toastData }, { status: 400 });
		}
	}
};
