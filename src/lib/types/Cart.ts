export type CartItem = {
	productId: string;
	productName: string;
	productSlug: string;
	unitPrice: number;
	quantity: number;
	lineTotal: number;
	productImage: string;
};

export type ShopGroupedItems = {
	shopId: number;
	shopName: string;
	shopAvatar: string;
	items: CartItem[];
	subtotal: number;
};

export type Cart = {
	userId: string;
	items: ShopGroupedItems[];
	subtotal: number;
};
