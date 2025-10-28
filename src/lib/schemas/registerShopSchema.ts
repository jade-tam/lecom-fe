import { z } from 'zod';
import { vnPrefixes } from './registerSchema';
import { shopBusinessOptions } from '$lib/consts/shopBusinessOptions';

// Enum for business type
const BusinessTypeEnum = z.enum(
	shopBusinessOptions.map((opt) => opt.value),
	'Business type must be either "personal" or "business"'
);

// Schema
export const registerShopSchema = z.object({
	shopName: z
		.string()
		.min(1, 'Shop name is required')
		.max(100, 'Shop name must be at most 100 characters'),

	shopDescription: z
		.string()
		.min(10, 'Please enter some description about your shop, atleast 10 characters')
		.max(500, 'Shop description must be at most 500 characters'),

	shopPhoneNumber: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Phone number must be 10 digits and start with 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Invalid Vietnam phone number prefix'
		}),

	shopAddress: z
		.string()
		.min(5, 'Shop address is required')
		.max(200, 'Shop address must be at most 200 characters'),

	businessType: BusinessTypeEnum,

	ownershipDocumentUrl: z.url('Ownership document must be a valid URL'),

	shopAvatar: z.url('Please upload shop avatar'),

	shopBanner: z.url('Please upload shop banner'),

	// shopFacebook: z
	// 	.url('Facebook link is not a valid URL')
	// 	.refine(
	// 		(value) =>
	// 			value.startsWith('https://www.facebook.com/') || value.startsWith('https://facebook.com/'),
	// 		'Facebook link must start with https://facebook.com/'
	// 	),

	// shopTiktok: z
	// 	.url('TikTok link is not a valid URL')
	// 	.refine(
	// 		(value) =>
	// 			value.startsWith('https://www.tiktok.com/@') || value.startsWith('https://tiktok.com/@'),
	// 		'TikTok link must start with https://tiktok.com/@'
	// 	),

	// shopInstagram: z
	// 	.url('Instagram link is not a valid URL')
	// 	.refine(
	// 		(value) =>
	// 			value.startsWith('https://www.instagram.com/') ||
	// 			value.startsWith('https://instagram.com/'),
	// 		'Instagram link must start with https://instagram.com/'
	// 	),

	categoryId: z.uuid('Please select a category'),

	acceptedTerms: z
		.boolean()
		.refine((val) => val === true, 'You must accept the terms before continue'),

	ownerFullName: z
		.string()
		.min(2, 'Owner full name is required')
		.max(100, 'Owner full name must be at most 100 characters'),

	ownerDateOfBirth: z
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
		})
		.refine((date) => {
			const age =
				(new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
			return age >= 18;
		}, 'You must be at least 18 years old to open shop'),

	ownerPersonalIdNumber: z
		.string()
		.min(5, 'Personal ID number is required')
		.max(20, 'Personal ID number must be at most 20 characters'),

	ownerPersonalIdFrontUrl: z.url('Must be a valid URL for front of ID'),
	ownerPersonalIdBackUrl: z.url('Must be a valid URL for back of ID')
});

export type RegisterShopSchema = z.infer<typeof registerShopSchema>;
