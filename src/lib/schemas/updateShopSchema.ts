import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

// Schema
export const updateShopSchema = z.object({
	id: z.int().min(1, 'Cần nhập mã cửa hàng'),

	name: z.string().min(1, 'Cần nhập tên cửa hàng').max(100, 'Tên cửa hàng tối đa 100 ký tự'),

	description: z
		.string()
		.min(10, 'Vui lòng nhập mô tả cửa hàng, ít nhất 10 ký tự')
		.max(500, 'Mô tả cửa hàng tối đa 500 ký tự'),

	phoneNumber: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Đầu số điện thoại không hợp lệ tại Việt Nam'
		}),

	address: z
		.string()
		.min(5, 'Cần nhập địa chỉ cửa hàng')
		.max(200, 'Địa chỉ cửa hàng tối đa 200 ký tự'),

	shopAvatar: z.url('Vui lòng tải lên ảnh đại diện cửa hàng'),

	shopBanner: z.url('Vui lòng tải lên ảnh banner cửa hàng'),

	shopFacebook: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === '' ||
				value.startsWith('https://www.facebook.com/') ||
				value.startsWith('https://facebook.com/'),
			'Liên kết Facebook phải bắt đầu bằng https://facebook.com/'
		)
		.nullable(),

	shopTiktok: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === '' ||
				value.startsWith('https://www.tiktok.com/@') ||
				value.startsWith('https://tiktok.com/@'),
			'Liên kết TikTok phải bắt đầu bằng https://tiktok.com/@'
		)
		.nullable(),

	shopInstagram: z
		.string()
		.trim()
		.refine(
			(value) =>
				value === '' ||
				value.startsWith('https://www.instagram.com/') ||
				value.startsWith('https://instagram.com/'),
			'Liên kết Instagram phải bắt đầu bằng https://instagram.com/'
		)
		.nullable()
});

export type UpdateShopSchema = z.infer<typeof updateShopSchema>;
