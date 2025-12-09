import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';
import type { shopBusinessOptions } from '$lib/consts/shopBusinessOptions';

export const shopStatusOptions = [
	{
		title: 'Đã chấp thuận',
		value: 'Approved'
	},
	{
		title: 'Đang chờ xử lý',
		value: 'Pending'
	},
	{
		title: 'Đã từ chối',
		value: 'Rejected'
	},
	{
		title: 'Không hoạt động',
		value: 'Inactive'
	}
] as const satisfies readonly FormSelectOption[];

export type ShopStatus = (typeof shopStatusOptions)[number]['value'];

export type BusinessType = (typeof shopBusinessOptions)[number]['value'];

export type Shop = {
	id: number;
	name: string;
	shopAvatar: string;
	shopBanner: string;
	description: string;
	phoneNumber: string;
	address: string;
	businessType: BusinessType;
	ownershipDocumentUrl: string;
	categoryId: string;
	categoryName: string;
	status: ShopStatus;
	rejectedReason: string | null;
	ownerFullName: string;
	ownerDateOfBirth: Date;
	ownerPersonalIdNumber: string;
	ownerPersonalIdFrontUrl: string;
	ownerPersonalIdBackUrl: string;
	sellerId: string;
	createdAt: Date;
	approvedAt: Date;
	shopFacebook: string;
	shopInstagram: string;
	shopTiktok: string;
};

export type SellerRegisterStatus = {
	status: ShopStatus;
	reason: string;
};
