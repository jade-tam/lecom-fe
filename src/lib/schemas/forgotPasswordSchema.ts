import z from 'zod';

export const forgotPasswordSchema = z.object({
	email: z.email({ message: 'Bạn có chắc đây là một email không?' })
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
