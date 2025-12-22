import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';
import type { ApprovalStatus } from './Product';

export const courseActiveStatusOptions = [
	{
		title: 'Hoạt động',
		value: 1
	},
	{
		title: 'Đã xoá',
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
	moderatorNote: string | null;
	approvalStatus: ApprovalStatus;
};

export const courseTypeOptions = [
	{
		title: 'Video',
		value: 'Video'
	},
	{
		title: 'Quiz',
		value: 'Quiz'
	}
] as const satisfies readonly FormSelectOption[];

export type CourseType = (typeof courseTypeOptions)[number]['value'];

export type Lesson = {
	id: string;
	courseSectionId: string;
	title: string;
	type: CourseType;
	durationSeconds: number;
	contentUrl: string;
	orderIndex: number;
	linkedProducts: LinkedProduct[];
	xpReward?: number;
	isCompleted?: boolean;
	moderatorNote: string | null;
	approvalStatus: ApprovalStatus;
	quiz?: {
		questions: {
			id: string;
			content: string;
			answers: {
				id: string;
				content: string;
				isCorrect: boolean;
			}[];
		}[];
	};
};

type LinkedProduct = {
	id: string;
	name: string;
	price: number;
	thumbnailUrl: string;
	shopName: string;
	categoryName?: string;
	slug: string;
};

// Another version of course data response from public api
export type CourseWithDetail = {
	id: string;
	title: string;
	slug: string;
	summary: string;
	categoryName: string;
	courseThumbnail: string;
	isEnrolled: boolean;
	shop: {
		id: number;
		name: string;
		avatar: string;
		description: string;
	};
	sections: Section[];
};

export type CourseLearning = {
	course: {
		id: string;
		title: string;
		summary: string;
		categoryName: string;
		shopName: string;
		thumbnail: string;
	};
	progress: {
		completedLessons: number;
		percent: number;
		totalLessons: number;
	};
	sections: Section[];
};

export type ModeratorPendingLesson = {
	id: string;
	title: string;
	sectionTitle: string;
	courseTitle: string;
};

export type ModeratorPendingSection = {
	id: string;
	title: string;
	courseTitle: string;
};
