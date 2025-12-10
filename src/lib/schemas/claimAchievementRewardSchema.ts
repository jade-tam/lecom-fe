import z from 'zod';

export const claimAchievementRewardSchema = z.object({
	id: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy id.')
});

export type ClaimAchievementRewardSchema = z.infer<typeof claimAchievementRewardSchema>;
