export interface OrderDetail {
	id: string | null;
	productId: string;
	productName: string;
	productImage: string | null;
	quantity: number;
	unitPrice: number;
	lineTotal: number;
	productSku: string | null;
	productCategory: string | null;
}

export interface Order {
	id: string;
	orderCode: string;
	userId: string;
	shopId: number;
	shopName: string;
	customerName: string | null;
	shipToName: string;
	shipToPhone: string;
	shipToAddress: string;
	subtotal: number;
	shippingFee: number;
	discount: number;
	total: number;
	status: string;
	paymentStatus: string;
	balanceReleased: boolean;
	createdAt: string; // ISO 8601 timestamp
	completedAt: string | null;
	details: OrderDetail[];
}
