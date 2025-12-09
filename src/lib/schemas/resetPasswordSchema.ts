import z from 'zod';

export const resetPasswordSchema = z
	.object({
		email: z.email({ message: 'Bạn có chắc đây là một email không?' }),
		token: z.string().trim().min(1, 'Có lỗi xảy ra, thiếu token'),
		newPassword: z
			.string()
			.trim()
			.min(8, 'Mật khẩu phải ít nhất 8 ký tự')
			.max(64, 'Mật khẩu không vượt quá 64 ký tự')
			.refine((val) => /[a-z]/.test(val), {
				message: 'Phải chứa ít nhất một chữ cái viết thường'
			})
			.refine((val) => /[A-Z]/.test(val), {
				message: 'Phải chứa ít nhất một chữ cái viết hoa'
			})
			.refine((val) => /\d/.test(val), {
				message: 'Phải chứa ít nhất một số'
			})
			.refine((val) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;]/.test(val), {
				message: 'Phải chứa ít nhất một ký tự đặc biệt'
			})
			.refine((val) => !/\s/.test(val), {
				message: 'Mật khẩu không được chứa khoảng trắng'
			}),
		confirmPassword: z.string().trim()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Mật khẩu không khớp',
		path: ['confirmPassword']
	});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
