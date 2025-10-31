import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const productStatusOptions = [
	{
		title: 'Draft',
		value: 'Draft'
	},
	{
		title: 'Published',
		value: 'Published'
	},
	{
		title: 'Out Of Stock',
		value: 'OutOfStock'
	},
	{
		title: 'Archived',
		value: 'Archived'
	}
] as const satisfies readonly FormSelectOption[];

export type ProductStatus = (typeof productStatusOptions)[number]['value'];

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
	shopName: string;
	shopAvatar: string;
};
