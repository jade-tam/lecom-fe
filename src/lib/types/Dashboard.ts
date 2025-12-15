import type { OrderStatus, PaymentStatus } from './Order';

export type RevenueChart = {
	date: string;
	revenue: number;
};

export type SellerDashboardTopProduct = {
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

export type DashboardViewType = 'day' | 'custom';

export type SellerDashboardData = {
	shopId: number;
	shopName: string;
	range: {
		view: DashboardViewType;
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
	topProducts: SellerDashboardTopProduct[];
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
		totalEarned: number;
		pendingWithdrawalAmount: number;
		approvedWithdrawalAmount: number;
		lastUpdatedAt: string;
	};
};

// Admin Dashboard Types ================================

export type AdminDashboardTopShop = {
	shopId: number;
	shopName: string;
	sellerName: string;
	shopLogoUrl: string;
	totalRevenue: number;
	totalOrders: number;
	averageRating: number;
	productCount: number;
};

export type AdminRevenueChart = {
	date: string;
	revenue: number;
	platformFee: number;
	orderCount: number;
};

export type AdminDashboardTopProduct = {
	productId: string;
	productName: string;
	thumbnailUrl: string;
	shopName: string;
	shopId: number;
	totalQuantity: number;
	totalRevenue: number;
	averageRating: number;
	feedbackCount: number;
};

export type AdminDashboardRecentOrder = {
	orderId: string;
	orderCode: string;
	createdAt: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	total: number;
	customerName: string;
	shopName: string;
};

export type AdminDashboardData = {
	range: {
		view: DashboardViewType;
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
		platformFee: number;
		totalRefundAmount: number;
		netRevenue: number;
		averageOrderValue: number;
		totalUsers: number;
		newUsers: number;
		activeShops: number;
		newShops: number;
	};
	revenueChart: AdminRevenueChart[];
	topShops: AdminDashboardTopShop[];
	topProducts: AdminDashboardTopProduct[];
	recentOrders: AdminDashboardRecentOrder[];
	refundSummary: {
		totalRequests: number;
		pendingAdminCount: number;
		approvedCount: number;
		rejectedCount: number;
		totalRefundAmount: number;
	};
	userSummary: {
		totalUsers: number;
		buyerCount: number;
		sellerCount: number;
		adminCount: number;
		newUsersInRange: number;
		activeUsersInRange: number;
	};
	systemHealth: {
		totalProducts: number;
		activeProducts: number;
		outOfStockProducts: number;
		totalShops: number;
		activeShops: number;
		pendingShops: number;
		averageSystemRating: number;
		totalFeedbacks: number;
	};
};
