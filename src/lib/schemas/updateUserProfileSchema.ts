import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

export const updateUserProfileSchema = z.object({
	id: z.string().optional(),
	imageUrl: z.url('Please upload an image').nullable(),
	fullName: z.string().trim().min(3, 'Atleast 3 characters').max(50, 'Too long'),
	userName: z
		.string()
		.trim()
		.min(3, 'Username must be at least 3 characters long')
		.max(20, 'Username cannot exceed 20 characters')
		.regex(/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, dots, and underscores')
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
	address: z.string().trim().min(8, 'Atleast 8 characters').max(200, 'Too long')
});

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
