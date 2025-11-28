import type { CourseActiveStatus } from '$lib/types/Course';
import type { ProductStatus } from '$lib/types/Product';
import type { ShopStatus } from '$lib/types/Shop';
import type { UserActiveStatus, UserRole } from '$lib/types/User';
import {
	orderStatusOptions,
	paymentStatusOptions,
	shipmentStatusOptions,
	type OrderStatus,
	type PaymentStatus
} from '$lib/types/Order';
import type { ShipmentStatus } from '$lib/types/Order';
import { haveAuthorization } from './others';
import type { QuestStatus } from '$lib/types/Gamification';
import type { RefundStatus } from '$lib/types/Refund';

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
	return haveAuthorization(role, 'Admin')
		? 'btn-error'
		: haveAuthorization(role, 'Moderator')
			? 'btn-info'
			: haveAuthorization(role, 'Seller')
				? 'btn-secondary'
				: '';
}

export function getUserRoleBadgeClass(role: UserRole | UserRole[]) {
	return haveAuthorization(role, 'Admin')
		? 'badge-error'
		: haveAuthorization(role, 'Moderator')
			? 'badge-info'
			: haveAuthorization(role, 'Seller')
				? 'badge-secondary'
				: '';
}

export function getOrderStatusBtnClass(status: OrderStatus) {
	return status === 'Pending'
		? 'btn-warning'
		: status === 'Paid'
			? 'btn-secondary'
			: status === 'Processing'
				? 'btn-secondary'
				: status === 'Shipping'
					? 'btn-info'
					: status === 'Completed'
						? 'btn-success'
						: // : status === 'Cancelled' || status === 'PaymentFailed'
							// 	? 'btn-error'
							status === 'Refunded'
							? 'btn-success'
							: 'btn-error';
}

export function getOrderStatusBadgeClass(status: OrderStatus) {
	return status === 'Pending'
		? 'badge-warning'
		: status === 'Paid'
			? 'badge-secondary'
			: status === 'Processing'
				? 'badge-secondary'
				: status === 'Shipping'
					? 'badge-info'
					: status === 'Completed'
						? 'badge-success'
						: // : status === 'Cancelled' || status === 'PaymentFailed'
							// 	? 'badge-error'
							status === 'Refunded'
							? 'badge-success'
							: 'badge-error';
}

export function getOrderStatusStepClass(
	stepValue: OrderStatus,
	currentStatus: OrderStatus
): string {
	const orderSteps: OrderStatus[] = orderStatusOptions.map((opt) => opt.value);
	const currentIdx = orderSteps.indexOf(currentStatus);
	const stepIdx = orderSteps.indexOf(stepValue);

	if (currentStatus === 'Cancelled') return stepIdx <= currentIdx ? 'step-error' : '';
	if (currentStatus === 'Shipping') return stepIdx <= currentIdx ? 'step-info' : '';
	if (currentStatus === 'Completed') return stepIdx <= currentIdx ? 'step-success' : '';
	if (currentStatus === 'Processing') return stepIdx <= currentIdx ? 'step-secondary' : '';
	if (currentStatus === 'Refunded') return stepIdx <= currentIdx ? 'step-success' : '';
	return stepIdx <= currentIdx ? 'step-warning' : '';
}

export function getPaymentStatusBadgeClass(status: PaymentStatus) {
	switch (status) {
		case 'Pending':
			return 'badge-warning';
		case 'Paid':
			return 'badge-success';
		case 'Failed':
			return 'badge-error';
		case 'Refunded':
			return 'badge-info';
		// case 'PartiallyRefunded':
		// 	return 'badge-secondary';
		default:
			return 'badge-error';
	}
}

export function getPaymentStatusBtnClass(status: PaymentStatus) {
	switch (status) {
		case 'Pending':
			return 'btn-warning';
		case 'Paid':
			return 'btn-success';
		case 'Failed':
			return 'btn-error';
		case 'Refunded':
			return 'btn-info';
		// case 'PartiallyRefunded':
		// 	return 'btn-secondary';
		default:
			return 'btn-error';
	}
}

export function getPaymentStatusStepClass(
	stepValue: PaymentStatus,
	currentStatus: PaymentStatus
): string {
	const paymentOrder: PaymentStatus[] = paymentStatusOptions.map((opt) => opt.value);
	const currentIdx = paymentOrder.indexOf(currentStatus);
	const stepIdx = paymentOrder.indexOf(stepValue);

	if (currentStatus === 'Failed') return stepIdx <= currentIdx ? 'step-error' : '';
	if (currentStatus === 'Paid') return stepIdx <= currentIdx ? 'step-success' : '';
	if (currentStatus === 'Refunded') return stepIdx <= currentIdx ? 'step-info' : '';
	return stepIdx <= currentIdx ? 'step-warning' : '';
}

export function getShipmentStatusStepClass(
	stepValue: ShipmentStatus,
	currentStatus: ShipmentStatus
): string {
	const shipmentOrder: ShipmentStatus[] = shipmentStatusOptions.map((opt) => opt.value);
	const currentIdx = shipmentOrder.indexOf(currentStatus);
	const stepIdx = shipmentOrder.indexOf(stepValue);

	if (currentStatus === 'Returned') return stepIdx <= currentIdx ? 'step-success' : '';
	if (currentStatus === 'Delivered') return stepIdx <= currentIdx ? 'step-success' : '';
	if (currentStatus === 'InTransit') return stepIdx <= currentIdx ? 'step-info' : '';
	return stepIdx <= currentIdx ? 'step-warning' : '';
}

export function getQuestStatusBtnClass(status: QuestStatus) {
	switch (status) {
		case 'NotStarted':
			return '';
		case 'InProgress':
			return 'btn-secondary';
		case 'Completed':
			return 'btn-warning';
		case 'Claimed':
			return 'btn-success';
		default:
			return 'btn-secondary';
	}
}

export function getQuestStatusBadgeClass(status: QuestStatus) {
	switch (status) {
		case 'NotStarted':
			return '';
		case 'InProgress':
			return 'badge-secondary';
		case 'Completed':
			return 'badge-warning';
		case 'Claimed':
			return 'badge-success';
		default:
			return 'badge-secondary';
	}
}

export function getRefundStatusClass(status: RefundStatus, type: 'btn' | 'badge') {
	switch (status) {
		case 'PendingShop':
			return type === 'btn' ? 'btn-secondary' : 'badge-secondary';
		case 'PendingAdmin':
			return type === 'btn' ? 'btn-error' : 'badge-error';
		case 'Refunded':
			return type === 'btn' ? 'btn-info' : 'badge-info';
		default:
			return 'badge-secondary';
	}
}
