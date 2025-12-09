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

export type Feedback = {
	id: string;
	userId: string;
	userName: string;
	userAvatar: string;
	productId: string;
	shopId: number;
	rating: number;
	content: string;
	images: string[];
	createdAt: string;
	reply: string | null;
};
