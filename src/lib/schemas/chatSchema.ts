import z from 'zod';

export const openChatSchema = z.object({
	productId: z.string().trim().min(1, { message: 'Không tìm thấy id sản phẩm' }),
	toAI: z.boolean()
});

export type OpenChatSchema = z.infer<typeof openChatSchema>;

export const chatSchema = z.object({
	content: z.string().trim().min(1, { message: 'Không có nội dung' }),
	toAI: z.boolean().optional()
});

export type ChatSchema = z.infer<typeof chatSchema>;
