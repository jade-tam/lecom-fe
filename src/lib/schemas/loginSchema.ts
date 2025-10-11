import z from 'zod';

export const loginSchema = z.object({
	username: z.string().trim().min(1, { message: 'Uh oh, you forgot something' }),
	password: z.string().trim().min(1, { message: 'Uh oh, you forgot something' })
});

export type LoginSchema = z.infer<typeof loginSchema>;
