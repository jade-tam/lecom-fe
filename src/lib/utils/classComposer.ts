import type { ProductStatus } from '$lib/types/Products';
import type { ShopStatus } from '$lib/types/Shop';

export function getStatusBtnClass(status: ShopStatus) {
	return status === 'Approved' ? 'btn-success' : status === 'Pending' ? 'btn-warning' : 'btn-error';
}

export function getStatusBadgeClass(status: ShopStatus) {
	return status === 'Approved'
		? 'badge-success'
		: status === 'Pending'
			? 'badge-warning'
			: 'badge-error';
}

export function getProductStatusBtnClass(status: ProductStatus) {
	return status === 'Publish' ? 'btn-success' : status === 'Draft' ? 'btn-secondary' : 'btn-error';
}

export function getProductStatusBadgeClass(status: ProductStatus) {
	return status === 'Publish'
		? 'badge-success'
		: status === 'Draft'
			? 'badge-secondary'
			: 'badge-error';
}
