import { z } from 'zod';
import { shopBusinessOptions } from '$lib/consts/shopBusinessOptions';
import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';

// Enum for business type
const BusinessTypeEnum = z.enum(
	shopBusinessOptions.map((opt) => opt.value),
	'Business type must be either "personal" or "business"'
);

// Schema
export const registerShopSchema = z.object({
	shopName: z.string().min(1, 'Tên cửa hàng là bắt buộc').max(100, 'Tên cửa hàng tối đa 100 ký tự'),

	shopDescription: z
		.string()
		.min(10, 'Vui lòng nhập mô tả cửa hàng, ít nhất 10 ký tự')
		.max(500, 'Mô tả cửa hàng tối đa 500 ký tự'),

	shopPhoneNumber: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Đầu số điện thoại không hợp lệ tại Việt Nam'
		}),

	shopAddress: z
		.string()
		.min(5, 'Địa chỉ cụ thể là bắt buộc')
		.max(100, 'Địa chỉ cụ thể tối đa 100 ký tự'),

	provinceId: z
		.number('Vui lòng chọn tỉnh / thành phố')
		.int('Vui lòng chọn tỉnh / thành phố')
		.min(1, 'Vui lòng chọn tỉnh / thành phố'),

	provinceName: z.string().min(1, 'Vui lòng chọn tỉnh / thành phố'),

	districtId: z
		.number('Vui lòng chọn quận / huyện')
		.int('Vui lòng chọn quận / huyện')
		.min(1, 'Vui lòng chọn quận / huyện'),

	districtName: z.string().min(1, 'Vui lòng chọn quận / huyện'),

	wardCode: z.string().min(1, 'Vui lòng chọn phường / xã'),

	wardName: z.string().min(1, 'Vui lòng chọn phường / xã'),

	businessType: BusinessTypeEnum,

	ownershipDocumentUrl: z.url('Tài liệu về sở hữu cửa hàng không hợp lệ').nullable(),

	shopAvatar: z.url('Vui lòng tải lên ảnh đại diện cửa hàng'),

	shopBanner: z.url('Vui lòng tải lên ảnh banner cửa hàng'),

	shopFacebook: z
		.string()
		.trim()
		.optional()
		.refine((value) => !value || /^https:\/\/(www\.)?facebook\.com\//.test(value), {
			message: 'Đường dẫn Facebook không hợp lệ'
		}),

	shopTiktok: z
		.string()
		.trim()
		.optional()
		.refine((value) => !value || /^https:\/\/(www\.)?tiktok\.com\/@/.test(value), {
			message: 'Đường dẫn TikTok không hợp lệ'
		}),

	shopInstagram: z
		.string()
		.trim()
		.optional()
		.refine((value) => !value || /^https:\/\/(www\.)?instagram\.com\//.test(value), {
			message: 'Đường dẫn Instagram không hợp lệ'
		}),

	categoryId: z.string().min(1, 'Vui lòng chọn một danh mục'),

	acceptedTerms: z
		.boolean()
		.refine((val) => val === true, 'Bạn phải chấp nhận các điều khoản trước khi tiếp tục'),

	ownerFullName: z
		.string()
		.min(2, 'Tên chủ sở hữu là bắt buộc')
		.max(100, 'Tên chủ sở hữu tối đa 100 ký tự'),

	ownerDateOfBirth: z
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
		})
		.refine((date) => {
			const age =
				(new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
			return age >= 18;
		}, 'Bạn phải ít nhất 18 tuổi để mở cửa hàng'),

	ownerPersonalIdNumber: z
		.string()
		.min(5, 'Số CMND/CCCD là bắt buộc')
		.max(20, 'Số CMND/CCCD tối đa 20 ký tự'),

	ownerPersonalIdFrontUrl: z.url('Vui lòng tải lên ảnh mặt trước CMND/CCCD'),
	ownerPersonalIdBackUrl: z.url('Vui lòng tải lên ảnh mặt sau CMND/CCCD')
});

export type RegisterShopSchema = z.infer<typeof registerShopSchema>;
