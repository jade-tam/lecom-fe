<script lang="ts">
	import { goto } from '$app/navigation';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import StatusSteps from '$lib/components/ui/StatusSteps.svelte';
	import ToolTip from '$lib/components/ui/ToolTip.svelte';
	import {
		shipmentStatusOptions,
		orderStatusOptions,
		paymentStatusOptions
	} from '$lib/types/Order';
	import type { Order } from '$lib/types/Order.js';
	import {
		getOrderStatusBadgeClass,
		getOrderStatusStepClass,
		getPaymentStatusBadgeClass,
		getShipmentStatusStepClass
	} from '$lib/utils/classComposer';
	import { formatDate, formatVND } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';

	const { data } = $props();
	const order: Order | null = $derived(data.order);

	function handleBack() {
		goto('/orders');
	}

	function getOrderStatusTitle(status: string) {
		const found = orderStatusOptions.find((opt) => opt.value === status);
		return found ? found.title : status;
	}

	function getPaymentStatusTitle(status: string) {
		const found = paymentStatusOptions.find((opt) => opt.value === status);
		return found ? found.title : status;
	}
</script>

{#if order}
	<!-- Top section like the image -->
	<div class="mt-2 mb-2 flex flex-wrap items-center justify-between">
		<div class="flex items-center gap-4">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-2xl font-bold">
				Mã đơn hàng: {order.orderCode}
			</h1>
			<span class={`ml-2 badge ${getOrderStatusBadgeClass(order.status)}`}>
				{getOrderStatusTitle(order.status)}
			</span>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn btn-sm btn-secondary" aria-label="Hóa đơn" disabled
				><span class="icon-[fa7-solid--scroll]"></span> Hóa đơn
			</button>
			<button class="btn btn-sm btn-info" aria-label="Theo dõi đơn hàng" disabled>
				<span class="icon-[fa7-solid--location]"></span>Theo dõi đơn hàng
			</button>
		</div>
	</div>
	<div class="mb-2 flex items-center gap-4">
		<p class="text-xs text-base-content/70">Ngày đặt hàng: {formatDate(order.createdAt)}</p>
	</div>

	<!-- Order Status Steps -->
	<section class="mb-2 flex flex-col items-center rounded-box border bg-base-100 p-4">
		<h3 class="mb-4 text-lg font-bold">Trạng thái đơn hàng</h3>
		<StatusSteps
			options={orderStatusOptions}
			status={order.status}
			icons={{
				Pending: 'icon-[fa7-solid--clock]',
				Paid: 'icon-[fa7-solid--money-bill]',
				Packed: 'icon-[fa7-solid--boxes-alt]',
				Shipped: 'icon-[fa7-solid--house-circle-check]',
				Completed: 'icon-[fa7-solid--check-circle]',
				Canceled: 'icon-[fa7-solid--ban]'
			}}
			getStepClass={getOrderStatusStepClass}
		/>
	</section>

	<!-- Product List Section -->
	<section class="mb-2 rounded-box border bg-base-100 p-4">
		<h2 class="mb-2 text-lg font-bold">Danh sách sản phẩm</h2>
		<div class="flex flex-1 flex-col gap-2">
			{#each order.details as item (item.id)}
				<div class="flex gap-4">
					<Image
						src={item.productImage}
						alt={item.productName}
						class="h-20 w-20 rounded-box object-cover"
					/>
					<div class="flex grow flex-col">
						<p class="line-clamp-1 font-medium">
							{item.productName}
						</p>
						<div class="flex items-baseline gap-2">
							<p class="text-sm font-light text-base-content/70">Giá:</p>
							<p class="font-serif font-bold text-base-content">
								{formatVND(item.unitPrice)}
							</p>
							<p class="ml-4 text-sm font-light text-base-content/70">Số lượng:</p>
							<p class="font-serif font-bold text-base-content">
								{item.quantity}
							</p>
						</div>
						<div class="mt-2 badge badge-sm badge-secondary">
							{item.productCategory}
						</div>
					</div>
					<div class="flex flex-col items-end">
						<p class="text-sm font-light text-base-content/70">Tổng cộng:</p>
						<p class="font-serif text-xl font-bold">
							<NumberFlow value={item.lineTotal} format={formatVND} /> đ
						</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Add this after your order details section -->
	<section class="mb-6">
		<div class="grid grid-cols-3 gap-2 max-md:grid-cols-1">
			<!-- Order Summary -->
			<div class="rounded-box border bg-base-100 p-4">
				<h2 class="mb-2 text-lg font-bold">Tóm tắt đơn hàng</h2>
				<div class="flex flex-col gap-2">
					<div class="flex justify-between">
						<span class="text-base">Tạm tính</span>
						<span class="font-serif font-bold">{formatVND(order.subtotal)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-base">Giảm giá</span>
						<span class="font-serif text-success-content">
							{order.discount > 0 ? `- ${formatVND(order.discount)}` : formatVND(0)}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="flex items-center gap-2 text-base">
							Phí giao hàng
							<ToolTip tip="Phí giao hàng là chi phí vận chuyển đơn hàng đến địa chỉ của bạn." />
						</span>
						<span class="font-serif">{formatVND(order.shippingFee)}</span>
					</div>
					<div class="divider"></div>
					<div class="flex justify-between text-lg font-bold">
						<span>Tổng đơn hàng</span>
						<span class="font-serif text-primary-content">{formatVND(order.total)}</span>
					</div>
				</div>
			</div>

			<!-- Delivery Info -->
			<div class="rounded-box border bg-base-100 p-4">
				<h2 class="mb-2 text-lg font-bold">Thông tin giao hàng</h2>
				<div class="flex flex-col gap-2">
					<p class="mb-4 flex items-center gap-2 text-success-content">
						<span class="icon-[fa7-solid--plane]"></span>
						Dự kiến giao:
						<span class="text-error-content"
							>{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '---'}</span
						>
					</p>
					<StatusSteps
						options={shipmentStatusOptions}
						status={order.shipmentStatus}
						icons={{
							Ready: 'icon-[fa7-solid--box-open]',
							InTransit: 'icon-[fa7-solid--truck]',
							Delivered: 'icon-[fa7-solid--house-circle-check]',
							Returned: 'icon-[fa7-solid--rotate-left]'
						}}
						getStepClass={getShipmentStatusStepClass}
					/>
					<div class="divider"></div>
					<p><span class="font-semibold">Người nhận:</span> {order.shipToName}</p>
					<p><span class="font-semibold">Số điện thoại:</span> {order.shipToPhone}</p>
					<p><span class="font-semibold">Địa chỉ:</span> {order.shipToAddress}</p>
				</div>
			</div>

			<!-- Payment Info -->
			<div class="rounded-box border bg-base-100 p-4">
				<h2 class="mb-2 text-lg font-bold">Trạng thái thanh toán</h2>
				<span class={`mb-2 badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
					{getPaymentStatusTitle(order.paymentStatus)}
				</span>
				<p class="mb-2">
					<span class="font-semibold">Phương thức thanh toán:</span>
					{order.paymentMethod ?? 'Không rõ'}
				</p>
			</div>
		</div>
	</section>
{:else}
	<EmptyPlaceholder
		icon="icon-[fa7-solid--box-open]"
		text="Không tìm thấy đơn hàng, Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
		description="Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
	/>
{/if}
