import z from 'zod';

export const moderatorActionSchema = z.object({
	id: z.string().trim().min(1, { message: 'Lỗi, không tìm thấy id' })
});

export type ModeratorActionSchema = z.infer<typeof moderatorActionSchema>;
