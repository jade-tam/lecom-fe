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

export type Section = {
	id: string;
	title: string;
	orderIndex: number;
	lessons: Lesson[];
};

export type Lesson = {
	id: string;
	courseSectionId: string;
	title: string;
	type: string;
	durationSeconds: number;
	contentUrl: string;
	orderIndex: number;
};

// Another version of course data response from public api
export type CourseWithDetail = {
	id: string;
	title: string;
	slug: string;
	summary: string;
	categoryName: string;
	courseThumbnail: string;
	shop: {
		id: number;
		name: string;
		avatar: string;
		description: string;
	};
	sections: Section[];
};
