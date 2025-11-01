import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const courseActiveStatusOptions = [
	{
		title: 'Active',
		value: 1
	},
	{
		title: 'Deleted',
		value: 0
	}
] as const satisfies readonly FormSelectOption[];

export type CourseActiveStatus = (typeof courseActiveStatusOptions)[number]['value'];

export type Course = {
	id: string;
	title: string;
	slug: string;
	summary: string;
	categoryId: string;
	categoryName: string;
	shopId: number;
	shopAvatar: string;
	shopName: string;
	courseThumbnail: string;
	active: CourseActiveStatus;
};
