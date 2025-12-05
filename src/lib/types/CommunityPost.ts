export type CommunityPost = {
	id: string;
	title: string;
	body: string;
	createdAt: string;
	user: CommunityUser;
	comments: CommunityComment[];
};

export type CommunityComment = {
	id: string;
	body: string;
	createdAt: string;
	user: CommunityUser;
};

export type CommunityUser = {
	id: string;
	userName: string;
	avatar: string;
};
export type ModeratorPendingCommunityPost = {
	id: string;
	title: string;
	body: string;
	userName: string;
	createdAt: string;
};
