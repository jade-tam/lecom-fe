import { redeemRewardSchema } from '$lib/schemas/redeemRewardSchema.js';
import type { GamificationProfile, RewardStoreItem } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies }) {
	// Mock reward store data
	const rewardStoreData: {
		boosters: RewardStoreItem[];
		vouchers: RewardStoreItem[];
	} = {
		boosters: [
			{
				id: 'booster-1',
				title: 'Tăng XP 2x trong 1 giờ',
				description: 'Nhận gấp đôi XP khi học trong 1 giờ tiếp theo.',
				coinCost: 300,
				type: 'booster',
				imageUrl: '/images/booster-xp.png',
				durationDescription: 'Có hiệu lực trong 1 giờ',
				redeemable: false
			},
			{
				id: 'booster-2',
				title: 'Khiên bảo vệ chuỗi ngày',
				description: 'Bảo vệ chuỗi ngày học tập của bạn khỏi bị mất khi bạn bỏ lỡ một ngày.',
				coinCost: 200,
				type: 'booster',
				imageUrl: '/images/booster-shield.png',
				durationDescription: 'Một lần sử dụng',
				redeemable: true
			}
		],
		vouchers: [
			{
				id: 'voucher-1',
				title: 'Phiếu giảm giá 50.000đ',
				description: 'Giảm 50.000đ cho đơn hàng tiếp theo.',
				coinCost: 1250,
				type: 'voucher',
				imageUrl: '/images/voucher-50k.png',
				durationDescription: 'Có hiệu lực trong 7 ngày',
				redeemable: true
			}
		]
	};

	const gamificationProfilePromise = getSafeResult(
		fetchAuthorizedApi<GamificationProfile>(cookies, '/api/gamification/profile', 'GET'),
		null
	);

	const form = await superValidate(zod4(redeemRewardSchema));

	return { rewardStoreData, gamificationProfilePromise, form };
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

		const toastData = getToastData(responseBody, 'Đổi phần thưởng thành công!');

		if (response.ok) {
			return message(form, { toastData: toastData });
		} else {
			return message(form, { toastData: toastData }, { status: 400 });
		}
	}
};
