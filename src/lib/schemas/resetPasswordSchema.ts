import z from 'zod';

export const resetPasswordSchema = z
	.object({
		email: z.email({ message: 'Are you sure this is an email?' }),
		token: z.string().trim().min(1, 'Token missing'),
		newPassword: z
			.string()
			.trim()
			.min(8, 'Password must be at least 8 characters long')
			.max(64, 'Password cannot exceed 64 characters')
			.refine((val) => /[a-z]/.test(val), {
				message: 'Must contain at least one lowercase letter'
			})
			.refine((val) => /[A-Z]/.test(val), {
				message: 'Must contain at least one uppercase letter'
			})
			.refine((val) => /\d/.test(val), {
				message: 'Must contain at least one number'
			})
			.refine((val) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;]/.test(val), {
				message: 'Must contain at least one special character'
			})
			.refine((val) => !/\s/.test(val), {
				message: 'Password cannot contain spaces'
			}),
		confirmPassword: z.string().trim()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Those passwords do not match',
		path: ['confirmPassword']
	});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
