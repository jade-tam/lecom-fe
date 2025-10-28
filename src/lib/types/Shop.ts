import type { shopBusinessOptions } from '$lib/consts/shopBusinessOptions';
import type { shopStatusOptions } from '$lib/consts/shopStatusOptions';

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
};
