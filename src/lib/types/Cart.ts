export type CartItem = {
	productId: string;
	productName: string;
	unitPrice: number;
	quantity: number;
	lineTotal: number;
	productImage: string;
};

export type Cart = {
	userId: string;
	items: CartItem[];
	subtotal: number;
};
