import { z } from 'zod';
import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';

// Schema
export const updateShopSchema = z.object({
	id: z.int().min(1, 'Shop id required'),

	name: z
		.string()
		.min(1, 'Shop name is required')
		.max(100, 'Shop name must be at most 100 characters'),

	description: z
		.string()
		.min(10, 'Please enter some description about your shop, atleast 10 characters')
		.max(500, 'Shop description must be at most 500 characters'),

	phoneNumber: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Phone number must be 10 digits and start with 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Invalid Vietnam phone number prefix'
		}),

	address: z
		.string()
		.min(5, 'Shop address is required')
		.max(200, 'Shop address must be at most 200 characters'),

	shopAvatar: z.url('Please upload shop avatar'),

	shopBanner: z.url('Please upload shop banner'),

	shopFacebook: z
		.url('Facebook link is not a valid URL')
		.refine(
			(value) =>
				value.startsWith('https://www.facebook.com/') || value.startsWith('https://facebook.com/'),
			'Facebook link must start with https://facebook.com/'
		),

	shopTiktok: z
		.url('TikTok link is not a valid URL')
		.refine(
			(value) =>
				value.startsWith('https://www.tiktok.com/@') || value.startsWith('https://tiktok.com/@'),
			'TikTok link must start with https://tiktok.com/@'
		),

	shopInstagram: z
		.url('Instagram link is not a valid URL')
		.refine(
			(value) =>
				value.startsWith('https://www.instagram.com/') ||
				value.startsWith('https://instagram.com/'),
			'Instagram link must start with https://instagram.com/'
		)
});

export type UpdateShopSchema = z.infer<typeof updateShopSchema>;
