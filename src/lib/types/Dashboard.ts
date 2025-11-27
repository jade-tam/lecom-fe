import type { OrderStatus, PaymentStatus } from './Order';

export type RevenueChart = {
	date: string;
	revenue: number;
};

export type DashboardTopProduct = {
	averageRating: number;
	feedbackCount: number;
	productId: string;
	productName: string;
	thumbnailUrl: string;
	totalQuantity: number;
	totalRevenue: number;
};

export type DashboardRecentOrder = {
	createdAt: string;
	customerName: string;
	orderCode: string;
	orderId: string;
	paymentStatus: PaymentStatus;
	status: OrderStatus;
	total: number;
};

export type SellerDashboardData = {
	shopId: number;
	shopName: string;
	range: {
		view: string;
		baseDate: string;
		from: string;
		to: string;
	};
	overview: {
		from: string;
		to: string;
		totalOrders: number;
		completedOrders: number;
		cancelledOrders: number;
		pendingOrders: number;
		totalRevenue: number;
		totalRefundAmount: number;
		netRevenue: number;
		averageOrderValue: number;
		uniqueCustomers: number;
	};
	revenueChart: RevenueChart[];
	topProducts: DashboardTopProduct[];
	recentOrders: DashboardRecentOrder[];
	refundSummary: {
		totalRequests: number;
		pendingCount: number;
		approvedCount: number;
		rejectedCount: number;
		totalRefundAmount: number;
	};
	ratingSummary: {
		averageRating: number;
		totalFeedbacks: number;
		rating1Count: number;
		rating2Count: number;
		rating3Count: number;
		rating4Count: number;
		rating5Count: number;
		positiveRate: number;
	};
	walletSummary: {
		availableBalance: number;
		pendingBalance: number;
		totalBalance: number;
		pendingWithdrawalAmount: number;
		approvedWithdrawalAmount: number;
		lastUpdatedAt: string;
	};
};

export type DashboardViewType = 'day' | 'custom';
