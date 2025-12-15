import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const productStatusOptions = [
	{
		title: 'Nháp',
		value: 'Draft'
	},
	{
		title: 'Đã xuất bản',
		value: 'Published'
	},
	{
		title: 'Hết hàng',
		value: 'OutOfStock'
	},
	{
		title: 'Đã lưu trữ',
		value: 'Archived'
	}
] as const satisfies readonly FormSelectOption[];

export type ProductStatus = (typeof productStatusOptions)[number]['value'];

export const approvalStatusOptions = [
	{
		title: 'Đang chờ duyệt',
		value: 'Pending'
	},
	{
		title: 'Đã được duyệt',
		value: 'Approved'
	},
	{
		title: 'Bị từ chối',
		value: 'Rejected'
	}
] as const satisfies readonly FormSelectOption[];

export type ApprovalStatus = (typeof approvalStatusOptions)[number]['value'];

export type ProductImageData = {
	url: string;
	orderIndex: number;
	isPrimary: boolean;
};

export type Product = {
	id: string;
	name: string;
	slug: string;
	description: string;
	categoryId: string;
	categoryName: string;
	price: number;
	stock: number;
	status: ProductStatus;
	lastUpdatedAt: string;
	images: ProductImageData[];
	thumbnailUrl: string;
	thumbnail?: string;
	shopId: number;
	shopName: string;
	shopAvatar: string;
	shopDescription: string;
	approvalStatus: ApprovalStatus;
	moderatorNote: null;
	averageRating?: number;
	ratingCount?: number;
};
