import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

export const shopAddressSchema = z.object({
	id: z.number().int('ID địa chỉ không hợp lệ').optional(),
	provinceId: z
		.number('Vui lòng chọn tỉnh / thành phố')
		.int('Mã tỉnh / thành phố không hợp lệ')
		.min(1, 'Vui lòng chọn tỉnh / thành phố'),
	provinceName: z.string().min(1, 'Vui lòng chọn tỉnh / thành phố'),
	districtId: z.number('Vui lòng chọn quận / huyện').int('Mã quận / huyện không hợp lệ').min(1, 'Vui lòng chọn quận / huyện'),
	districtName: z.string().min(1, 'Vui lòng chọn quận / huyện'),
	wardCode: z.string().min(1, 'Vui lòng chọn phường / xã'),
	wardName: z.string().min(1, 'Vui lòng chọn phường / xã'),
	detailAddress: z
		.string()
		.trim()
		.min(5, 'Địa chỉ chi tiết phải có ít nhất 5 ký tự')
		.max(200, 'Địa chỉ chi tiết tối đa 200 ký tự'),
	contactName: z
		.string()
		.trim()
		.min(2, 'Tên người liên hệ phải có ít nhất 2 ký tự')
		.max(100, 'Tên người liên hệ tối đa 100 ký tự'),
	contactPhone: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Đầu số điện thoại không hợp lệ tại Việt Nam'
		}),
	isDefault: z.boolean().default(true)
});

export type ShopAddressSchema = z.infer<typeof shopAddressSchema>;
