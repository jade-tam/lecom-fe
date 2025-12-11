import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export type FeedbackSummary = {
	productId: string;
	averageRating: number;
	totalFeedbackCount: number;
	rating1Count: number;
	rating2Count: number;
	rating3Count: number;
	rating4Count: number;
	rating5Count: number;
	positiveRate: number;
	recentFeedbacks: Feedback[];
};

export const feedbackRatingOptions = [
	{ value: 5, title: '5 sao' },
	{ value: 4, title: '4 sao' },
	{ value: 3, title: '3 sao' },
	{ value: 2, title: '2 sao' },
	{ value: 1, title: '1 sao' }
] as const satisfies readonly FormSelectOption[];

export type FeedbackRating = (typeof feedbackRatingOptions)[number]['value'];

export type Feedback = {
	id: string;
	userId: string;
	userName: string;
	userAvatar: string;
	productId: string;
	shopId: number;
	rating: FeedbackRating;
	content: string;
	images: string[];
	createdAt: string;
	reply: {
		content: string;
		createdAt: string;
	} | null;
};
