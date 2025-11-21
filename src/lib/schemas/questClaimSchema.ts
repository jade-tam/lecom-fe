import z from 'zod';

export const questClaimSchema = z.object({
	userQuestId: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy id nhiệm vụ.')
});

export type QuestClaimSchema = z.infer<typeof questClaimSchema>;
