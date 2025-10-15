import z from 'zod';

export const forgotPasswordSchema = z.object({
	email: z.email({ message: 'Are you sure this is an email?' })
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
