import type { CourseActiveStatus } from '$lib/types/Course';
import type { ProductStatus } from '$lib/types/Product';
import type { ShopStatus } from '$lib/types/Shop';

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
