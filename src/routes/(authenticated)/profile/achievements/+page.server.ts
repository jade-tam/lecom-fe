import { redeemRewardSchema } from '$lib/schemas/redeemRewardSchema.js';
import type { ApiUserAchivements } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies }) {
	// Mock achievements data
	const achievementsData: ApiUserAchivements = {
		categories: [
			{ value: 'learning', title: 'Học tập' },
			{ value: 'shopping', title: 'Mua sắm' },
			{ value: 'social', title: 'Xã hội' },
			{ value: 'special', title: 'Đặc biệt' }
		],
		achievements: [
			{
				id: 'achv-1',
				category: 'learning',
				imageUrl: '/images/achv-complete-10-lessons.png',
				title: 'Hoàn thành 10 bài học',
				description: 'Hoàn thành 10 bài học đầu tiên.',
				currentCount: 4,
				targetCount: 10,
				xpReward: 100,
				coinReward: 20,
				isCompleted: false,
				isRewardClaimed: false
			},
			{
				id: 'achv-2',
				category: 'shopping',
				imageUrl: '/images/achv-first-purchase.png',
				title: 'Mua hàng đầu tiên',
				description: 'Hoàn thành đơn hàng đầu tiên.',
				currentCount: 1,
				targetCount: 1,
				xpReward: 50,
				coinReward: 10,
				isCompleted: true,
				isRewardClaimed: false,
				completedAt: new Date().toISOString()
			},
			{
				id: 'achv-3',
				category: 'social',
				imageUrl: '/images/achv-invite-friend.png',
				title: 'Mời bạn bè',
				description: 'Mời một người bạn tham gia hệ thống.',
				currentCount: 0,
				targetCount: 1,
				xpReward: 30,
				coinReward: 5,
				isCompleted: true,
				isRewardClaimed: true,
				completedAt: new Date().toISOString()
			}
		]
	};

	const form = await superValidate(zod4(redeemRewardSchema));

	return { achievementsData, form };
}

export const actions = {
	claimReward: async ({ request, cookies }) => {
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

		const toastData = getToastData(responseBody, 'Đổi phần thưởng thành công!');

		if (response.ok) {
			return message(form, { toastData: toastData });
		} else {
			return message(form, { toastData: toastData }, { status: 400 });
		}
	}
};
