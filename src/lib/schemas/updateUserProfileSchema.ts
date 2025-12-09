import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

export const updateUserProfileSchema = z.object({
	id: z.string().optional(),
	imageUrl: z.url('Vui lòng tải lên ảnh').nullable(),
	fullName: z.string().trim().min(3, 'Tối thiểu 3 ký tự').max(50, 'Quá dài'),
	userName: z
		.string()
		.trim()
		.min(3, 'Tên người dùng phải ít nhất 3 ký tự')
		.max(20, 'Tên người dùng không vượt quá 20 ký tự')
		.regex(
			/^[a-zA-Z0-9._]+$/,
			'Tên người dùng chỉ được chứa chữ cái, số, dấu chấm và dấu gạch dưới'
		)
		.regex(/^(?![_.])(?!.*[_.]$)(?!.*[_.]{2})[a-zA-Z0-9._]+$/, {
			message:
				'Tên người dùng không được bắt đầu hoặc kết thúc bằng . hoặc _, hoặc chứa các dấu chấm/gạch dưới liên tiếp'
		}),
	dateOfBirth: z
		.string('Vui lòng nhập ngày sinh của bạn')
		.trim()
		.refine(
			(val) => {
				const date = new Date(val);
				return !isNaN(date.getTime());
			},
			{ message: 'Định dạng ngày không hợp lệ' }
		)
		.refine((date) => new Date(date) <= new Date(), {
			message: 'Ngày sinh không được là tương lai'
		}),
	phoneNumber: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Đầu số điện thoại không hợp lệ tại Việt Nam'
		}),
	address: z.string().trim().min(8, 'Tối thiểu 8 ký tự').max(200, 'Quá dài')
});

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
