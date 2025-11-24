import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export type LocalUser = {
	id: string;
	email: string;
	name: string;
	role: UserRole | UserRole[];
};

export type User = {
	id: string;
	fullName: string;
	userName: string;
	email: string;
	phoneNumber: string;
	address: string;
	dateOfBirth: string;
	isActive: boolean;
	roles: UserRole | UserRole[];
};

export const userRoleOptions = [
	{
		title: 'Customer',
		value: 'Customer'
	},
	{
		title: 'Seller',
		value: 'Seller'
	},
	{
		title: 'Admin',
		value: 'Admin'
	},
	{
		title: 'Moderator',
		value: 'Moderator'
	}
] as const satisfies readonly FormSelectOption[];

export type UserRole = (typeof userRoleOptions)[number]['value'];

export const userActiveStatusOptions = [
	{
		title: 'Active',
		value: true
	},
	{
		title: 'Inactive',
		value: false
	}
] as const satisfies readonly FormSelectOption[];

export type UserActiveStatus = (typeof userActiveStatusOptions)[number]['value'];

export type UserDetailAdmin = {
	fullName: string;
	imageUrl: string;
	dateOfBirth: string;
	address: string;
	isActive: boolean;
	refreshToken: string;
	refreshTokenExpiryTime: string | null;
	certificateImageUrl: string | null;
	shop: null;
	addresses: string[];
	enrollments: string[];
	certificates: string[];
	reviews: string[];
	userBadges: string[];
	userVouchers: string[];
	posts: string[];
	comments: string[];
	notifications: string[];
	id: string;
	userName: string;
	normalizedUserName: string;
	email: string;
	normalizedEmail: string;
	emailConfirmed: boolean;
	passwordHash: string;
	securityStamp: string;
	concurrencyStamp: string;
	phoneNumber: string;
	phoneNumberConfirmed: boolean;
	twoFactorEnabled: boolean;
	lockoutEnd: null;
	lockoutEnabled: boolean;
	accessFailedCount: number;
};
