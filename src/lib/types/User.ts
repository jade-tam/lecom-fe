export type UserRole = 'Customer' | 'Seller' | 'Admin';

export type User = {
	id: string;
	email: string;
	name: string;
	role: UserRole | UserRole[];
};
