import z from 'zod';

export const redeemRewardSchema = z.object({
	rewardCode: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy rewardCode.')
});

export type RedeemRewardSchema = z.infer<typeof redeemRewardSchema>;

export const createRedeemRuleSchema = z.object({
	reward: z.string().min(1, 'Mã phần thưởng không được để trống'),
	costPoints: z.number().min(1, 'Giá xu phải lớn hơn 0'),
	active: z.boolean().default(true)
});
export type CreateRedeemRuleSchema = z.infer<typeof createRedeemRuleSchema>;

export const updateRedeemRuleSchema = z.object({
	id: z.string().min(1, 'ID không được để trống'),
	costPoints: z.number().min(1, 'Giá xu phải lớn hơn 0'),
	active: z.boolean()
});
export type UpdateRedeemRuleSchema = z.infer<typeof updateRedeemRuleSchema>;
