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
