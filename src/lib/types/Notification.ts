export type Notification = {
	id: string;
	type: string;
	title: string;
	content: string;
	isRead: boolean;
	createdAt: string; // ISO date string
};
