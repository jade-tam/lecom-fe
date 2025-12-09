import z from 'zod';

export const adminCreateBroadcastSchema = z.object({
	type: z.string().min(1, 'Loại broadcast không được để trống'),
	title: z.string().min(1, 'Tiêu đề không được để trống'),
	content: z.string().min(1, 'Nội dung không được để trống')
});

export type AdminCreateBroadcastSchema = z.infer<typeof adminCreateBroadcastSchema>;
