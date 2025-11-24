import { discountTypeOptions } from '$lib/types/Voucher';
import { z } from 'zod';

const discountTypeEnum = z.enum(discountTypeOptions.map((option) => option.value));

export const createVoucherSchema = z
	.object({
		code: z
			.string()
			.min(1, 'Mã voucher không được để trống')
			.max(20, 'Mã voucher tối đa 20 ký tự')
			.regex(/^[A-Za-z0-9]+$/, 'Mã voucher chỉ được chứa chữ cái và số, không có khoảng trắng'),
		discountType: discountTypeEnum.default('Percentage'),
		discountValue: z.number().min(1, 'Giá trị giảm phải lớn hơn 1'),
		maxDiscountAmount: z.number().min(5000, 'Giá trị giảm tối đa phải lớn hơn 5.000₫'),
		minOrderAmount: z.number().min(10000, 'Giá trị đơn tối thiểu phải lớn hơn 10.000₫'),
		usageLimitPerUser: z.number().min(1, 'Giới hạn sử dụng của mỗi người phải lớn hơn 1'),
		quantityAvailable: z.number().min(1, 'Số lượng phải lớn hơn 1'),
		startDate: z
			.string({ error: 'Vui lòng nhập ngày bắt đầu' })
			.trim()
			.refine(
				(val) => {
					const date = new Date(val);
					return !isNaN(date.getTime());
				},
				{ message: 'Ngày bắt đầu không hợp lệ' }
			)
			.refine((val) => new Date(val) >= new Date(), {
				message: 'Ngày bắt đầu phải là hôm nay hoặc sau hôm nay'
			}),
		endDate: z
			.string({ error: 'Vui lòng nhập ngày kết thúc' })
			.trim()
			.refine(
				(val) => {
					const date = new Date(val);
					return !isNaN(date.getTime());
				},
				{ message: 'Ngày kết thúc không hợp lệ' }
			),
		isActive: z.boolean().default(true)
	})
	.refine((data) => new Date(data.endDate) > new Date(data.startDate), {
		message: 'Ngày kết thúc phải sau ngày bắt đầu',
		path: ['endDate']
	});

export type CreateVoucherSchema = z.infer<typeof createVoucherSchema>;
