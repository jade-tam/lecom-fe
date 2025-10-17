type AdminSidebarLayoutItem = {
	href: string;
	title: string;
	iconClass: string;
};

export const adminSidebarLayout: AdminSidebarLayoutItem[] = [
	{
		href: '/admin/dashboard',
		title: 'Dashboard',
		iconClass: 'icon-[fa7-solid--tachometer-alt] text-xl'
	},
	{
		href: '/admin/analytics',
		title: 'Analytics',
		iconClass: 'icon-[fa7-solid--chart-line] text-xl'
	},
	{
		href: '/admin/users-management',
		title: 'Users Management',
		iconClass: 'icon-[fa7-solid--users-cog] text-xl'
	},
	{
		href: '/admin/courses-management',
		title: 'Courses Management',
		iconClass: 'icon-[fa7-solid--book-open] text-xl'
	},
	{
		href: '/admin/shops-management',
		title: 'Shops Management',
		iconClass: 'icon-[fa7-solid--shop] text-xl'
	},
	{
		href: '/admin/categories-management',
		title: 'Categories Management',
		iconClass: 'icon-[fa7-solid--swatchbook] text-xl'
	},
	{
		href: '/admin/reports-and-feedbacks',
		title: 'Reports & Feedbacks',
		iconClass: 'icon-[fa7-solid--file-waveform] text-xl'
	}
];
