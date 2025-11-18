import type { CourseActiveStatus } from '$lib/types/Course';
import type { ProductStatus } from '$lib/types/Product';
import type { ShopStatus } from '$lib/types/Shop';
import type { UserActiveStatus, UserRole } from '$lib/types/User';
import type { OrderStatus, PaymentStatus } from '$lib/types/Order';

export function getStatusBtnClass(status: ShopStatus) {
	return status === 'Approved'
		? 'btn-success'
		: status === 'Pending'
			? 'btn-warning'
			: status === 'Inactive'
				? 'btn-error'
				: 'btn-error';
}

export function getStatusBadgeClass(status: ShopStatus) {
	return status === 'Approved'
		? 'badge-success'
		: status === 'Pending'
			? 'badge-warning'
			: status === 'Inactive'
				? 'badge-error'
				: 'badge-error';
}

export function getProductStatusBtnClass(status: ProductStatus) {
	return status === 'Published'
		? 'btn-success'
		: status === 'Draft'
			? 'btn-secondary'
			: status === 'Archived'
				? 'btn-info'
				: 'btn-error';
}

export function getProductStatusBadgeClass(status: ProductStatus) {
	return status === 'Published'
		? 'badge-success'
		: status === 'Draft'
			? 'badge-secondary'
			: status === 'Archived'
				? 'btn-info'
				: 'badge-error';
}

export function getCourseActiveStatusBtnClass(active: CourseActiveStatus) {
	return active === 1 ? 'btn-success' : 'btn-error';
}

export function getCourseActiveStatusBadgeClass(active: CourseActiveStatus) {
	return active === 1 ? 'badge-success' : 'badge-error';
}

export function getUserActiveStatusBtnClass(active: UserActiveStatus) {
	return active === true ? 'btn-success' : 'btn-error';
}

export function getUserActiveStatusBadgeClass(active: UserActiveStatus) {
	return active === true ? 'badge-success' : 'badge-error';
}

export function getUserRoleBtnClass(role: UserRole | UserRole[]) {
	return role === 'Admin' ? 'btn-error' : role === 'Seller' ? 'btn-info' : 'btn-secondary';
}

export function getUserRoleBadgeClass(role: UserRole | UserRole[]) {
	return role === 'Admin' ? 'badge-error' : role === 'Seller' ? 'badge-info' : 'badge-secondary';
}

export function getOrderStatusBtnClass(status: OrderStatus) {
	return status === 'Pending'
		? 'btn-warning'
		: status === 'Paid'
			? 'btn-info'
			: status === 'Packed'
				? 'btn-secondary'
				: status === 'Shipped'
					? 'btn-accent'
					: status === 'Completed'
						? 'btn-success'
						: status === 'Canceled'
							? 'btn-error'
							: 'btn-error';
}

export function getOrderStatusBadgeClass(status: OrderStatus) {
	return status === 'Pending'
		? 'badge-warning'
		: status === 'Paid'
			? 'badge-info'
			: status === 'Packed'
				? 'badge-secondary'
				: status === 'Shipped'
					? 'badge-accent'
					: status === 'Completed'
						? 'badge-success'
						: status === 'Canceled'
							? 'badge-error'
							: 'badge-error';
}

export function getPaymentStatusBadgeClass(status: PaymentStatus) {
	return status === 'Pending'
		? 'badge-warning'
		: status === 'Succeeded'
			? 'badge-success'
			: status === 'Failed'
				? 'badge-error'
				: status === 'Refunded'
					? 'badge-info'
					: status === 'PartiallyRefunded'
						? 'badge-secondary'
						: 'badge-error';
}

export function getPaymentStatusBtnClass(status: PaymentStatus) {
	return status === 'Pending'
		? 'btn-warning'
		: status === 'Succeeded'
			? 'btn-success'
			: status === 'Failed'
				? 'btn-error'
				: status === 'Refunded'
					? 'btn-info'
					: status === 'PartiallyRefunded'
						? 'btn-secondary'
						: 'btn-error';
}
