import z from 'zod';

export const redeemRewardSchema = z.object({
	rewardCode: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy rewardCode.')
});

export type RedeemRewardSchema = z.infer<typeof redeemRewardSchema>;
