import { resolve } from '$app/paths';

export type SidebarLayoutItem = {
	href: string;
	title: string;
	iconClass: string;
	subItems?: SidebarLayoutItem[];
};

export const adminSidebarLayout: SidebarLayoutItem[] = [
	{
		href: '/admin/dashboard',
		title: 'Tổng quan',
		iconClass: 'icon-[mingcute--dashboard-3-fill] text-xl'
	},
	// {
	// 	href: '/admin/analytics',
	// 	title: 'Phân tích',
	// 	iconClass: 'icon-[mingcute--chart-vertical-fill] text-xl'
	// },
	{
		href: '/admin/users-management',
		title: 'Quản lý người dùng',
		iconClass: 'icon-[mingcute--user-setting-fill] text-xl'
	},
	// {
	// 	href: '/admin/courses-management',
	// 	title: 'Quản lý khóa học',
	// 	iconClass: 'icon-[fa7-solid--book-open] text-xl'
	// },
	{
		href: '/admin/shops-management',
		title: 'Quản lý cửa hàng',
		iconClass: 'icon-[mingcute--shop-fill] text-xl'
	},
	{
		href: '/admin/refund-review',
		title: 'Xét duyệt hoàn tiền',
		iconClass: 'icon-[mingcute--card-refund-fill] text-xl'
	},
	{
		href: '/admin/categories-management',
		title: 'Quản lý danh mục',
		iconClass: 'icon-[fa7-solid--swatchbook] text-xl',
		subItems: [
			{
				href: '/admin/course-categories-management',
				title: 'Danh mục khóa học',
				iconClass: 'icon-[mingcute--notebook-2-fill] text-xl'
			},
			{
				href: '/admin/product-categories-management',
				title: 'Danh mục sản phẩm',
				iconClass: 'icon-[mingcute--box-2-fill] text-xl'
			}
		]
	},
	{
		href: '/admin/voucher-config',
		title: 'Cài đặt phiếu giảm giá',
		iconClass: 'icon-[mingcute--ticket-fill] text-xl'
	},
	{
		href: '/admin/redeem-rule-config',
		title: 'Cài đặt mục đổi thưởng',
		iconClass: 'icon-[mingcute--store-fill] text-xl'
	},

	{
		href: '/admin/reports-and-feedbacks',
		title: 'Báo cáo & Phản hồi',
		iconClass: 'icon-[mingcute--file-warning-fill] text-xl'
	}
];

export const sellerSidebarLayout: SidebarLayoutItem[] = [
	{
		href: '/seller/dashboard',
		title: 'Tổng quan',
		iconClass: 'icon-[mingcute--dashboard-3-fill] text-xl'
	},
	{
		href: '/seller/my-shop',
		title: 'Cửa hàng của tôi',
		iconClass: 'icon-[mingcute--shop-fill] text-xl'
	},
	{
		href: '/seller/products',
		title: 'Quản lý sản phẩm',
		iconClass: 'icon-[mingcute--box-2-fill] text-xl'
	},
	{
		href: '/seller/courses',
		title: 'Quản lý khóa học',
		iconClass: 'icon-[mingcute--notebook-2-fill] text-xl'
	},
	{
		href: '/seller/orders',
		title: 'Danh sách đơn hàng',
		iconClass: 'icon-[mingcute--cash-fill] text-xl'
	},
	{
		href: '/seller/refunds',
		title: 'Yêu cầu hoàn tiền',
		iconClass: 'icon-[mingcute--card-refund-fill] text-xl'
	},
	{
		href: '/seller/wallet',
		title: 'Ví cửa hàng',
		iconClass: 'icon-[mingcute--wallet-3-fill] text-xl'
	}
	// {
	// 	href: '/seller/analytics',
	// 	title: 'Phân tích',
	// 	iconClass: 'icon-[mingcute--chart-vertical-fill] text-xl'
	// }
];

export const moderatorSidebarLayout: SidebarLayoutItem[] = [
	{
		href: resolve('/(moderator)/moderator/products-management'),
		title: 'Duyệt sản phẩm',
		iconClass: 'icon-[mingcute--box-2-fill] text-xl'
	},
	{
		href: resolve('/(moderator)/moderator/courses-management'),
		title: 'Duyệt khóa học',
		iconClass: 'icon-[mingcute--notebook-2-fill] text-xl'
	}
];
