import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

export const registerSchema = z
	.object({
		fullName: z.string().trim().min(3, 'Atleast 3 characters').max(50, 'Too long'),
		userName: z
			.string()
			.trim()
			.min(3, 'Username must be at least 3 characters long')
			.max(20, 'Username cannot exceed 20 characters')
			.regex(
				/^[a-zA-Z0-9._]+$/,
				'Username can only contain letters, numbers, dots, and underscores'
			)
			.regex(/^(?![_.])(?!.*[_.]$)(?!.*[_.]{2})[a-zA-Z0-9._]+$/, {
				message: 'Username cannot start or end with . or _, or contain consecutive dots/underscores'
			}),
		dateOfBirth: z
			.string('Please enter your date of birth')
			.trim()
			.refine(
				(val) => {
					const date = new Date(val);
					return !isNaN(date.getTime());
				},
				{ message: 'Invalid date format' }
			)
			.refine((date) => new Date(date) <= new Date(), {
				message: 'Date of birth cannot be in the future'
			}),
		phoneNumber: z
			.string()
			.trim()
			.refine((val) => /^0\d{9}$/.test(val), {
				message: 'Phone number must be 10 digits and start with 0'
			})
			.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
				message: 'Invalid Vietnam phone number prefix'
			}),
		address: z.string().trim().min(8, 'Atleast 8 characters').max(200, 'Too long'),
		email: z.email({ message: 'Are you sure this is an email?' }),
		password: z
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
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Those passwords do not match',
		path: ['confirmPassword']
	});

export type RegisterSchema = z.infer<typeof registerSchema>;
