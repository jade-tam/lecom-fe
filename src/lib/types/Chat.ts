export type Conversation = {
	buyerId: string;
	id: string;
	isAIChat: boolean;
	lastMessage: string;
	lastMessageAt: string;
	product: {
		id: string;
		name: string;
		thumbnail: string;
	};
	sellerId: string;
	displayName: string;
	displayAvatar: string;
	role: 'ai' | 'seller' | 'buyer';
};

export type ChatMessage = {
	id: string;
	senderId: string;
	senderName: string;
	senderAvatar: string;
	content: string;
	isRead: boolean;
	createdAt: string;
};
