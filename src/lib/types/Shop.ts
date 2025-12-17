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
	provinceId: number;
	provinceName: string;
	districtId: number;
	districtName: string;
	wardCode: string;
	wardName: string;
	address: string;
	businessType: BusinessType;
	ownershipDocumentUrl: string | null;
	categoryId: string;
	categoryName: string;
	status: ShopStatus;
	rejectedReason: string | null;
	ownerFullName: string;
	ownerDateOfBirth: string;
	ownerPersonalIdNumber: string;
	ownerPersonalIdFrontUrl: string;
	ownerPersonalIdBackUrl: string;
	sellerId: string;
	createdAt: string;
	approvedAt: string | null;
	shopFacebook: string | null;
	shopInstagram: string | null;
	shopTiktok: string | null;
};

export type SellerRegisterStatus = {
	status: ShopStatus;
	rejectedReason: string;
};

export type ShopAddress = {
	id: number;
	shopId: number;
	provinceId: number;
	provinceName: string;
	districtId: number;
	districtName: string;
	wardCode: string;
	wardName: string;
	detailAddress: string;
	isDefault: boolean;
	contactName: string;
	contactPhone: string;
};

export type AddressProvince = { ProvinceID: number; ProvinceName: string; Code: string };

export type AddressDistrict = {
	DistrictID: number;
	ProvinceID: number;
	DistrictName: string;
	Code: string;
};

export type AddressWard = { WardCode: string; DistrictID: number; WardName: string };

export type GHNStatus = {
	isConnected: boolean;
	ghnShopId: string | null;
	connectedAt: string | null;
	message: string;
};
