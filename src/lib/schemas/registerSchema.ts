import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.string().trim().email({ message: 'Your email seems... weird' }),
		password: z.string().trim().min(8, { message: 'Password must be at least 8 characters' }),
		confirmPassword: z.string().trim()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Those passwords do not match',
		path: ['confirmPassword']
	});

export type RegisterSchema = typeof registerSchema;
