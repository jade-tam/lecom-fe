import z from 'zod';

export const moderatorActionSchema = z.object({
	id: z.string().trim().min(1, { message: 'Lỗi, không tìm thấy id' }),
	reason: z.string().trim().min(20, { message: 'Vui lòng nhập lý do, ít nhất 20 ký tự' }).optional()
});

export type ModeratorActionSchema = z.infer<typeof moderatorActionSchema>;
