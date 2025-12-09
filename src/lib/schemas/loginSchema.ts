import z from 'zod';

export const loginSchema = z.object({
	username: z.string().trim().min(1, { message: 'Bạn quên điền gì rồi' }),
	password: z.string().trim().min(1, { message: 'Bạn quên điền gì rồi' })
});

export type LoginSchema = z.infer<typeof loginSchema>;
