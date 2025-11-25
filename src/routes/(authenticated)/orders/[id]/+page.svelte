<script lang="ts">
	import { goto } from '$app/navigation';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import StatusSteps from '$lib/components/ui/StatusSteps.svelte';
	import ToolTip from '$lib/components/ui/ToolTip.svelte';
	import {
		orderStatusOptions,
		paymentStatusOptions,
		shipmentStatusOptions
	} from '$lib/types/Order';
	import type { Order, ShipmentStatus } from '$lib/types/Order.js';
	import {
		getOrderStatusBadgeClass,
		getOrderStatusStepClass,
		getPaymentStatusBadgeClass,
		getPaymentStatusStepClass,
		getShipmentStatusStepClass
	} from '$lib/utils/classComposer';
	import { formatDate, formatVND } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';

	const { data } = $props();
	const order: Order | null = $derived(data.order);
	const shipmentStatus: ShipmentStatus = $derived.by(() => {
		switch (order?.status) {
			case 'Pending':
			case 'Paid':
			case 'Processing':
			case 'PaymentFailed':
				return 'Ready';
			case 'Shipping':
				return 'InTransit';
			case 'Completed':
				return 'Delivered';
			case 'Cancelled':
			case 'Refunded':
				return 'Returned';
			default:
				return 'Ready';
		}
	});

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
		<AnimatedDiv animateVars={{ translateX: -16 }} class="flex items-center gap-4">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-2xl font-bold">
				Mã đơn hàng: {order.orderCode}
			</h1>
			<span class={`ml-2 badge ${getOrderStatusBadgeClass(order.status)}`}>
				{getOrderStatusTitle(order.status)}
			</span>
		</AnimatedDiv>
		<AnimatedDiv animateVars={{ translateX: 16 }} class="flex items-center gap-2">
			<button class="btn btn-sm btn-secondary" aria-label="Hóa đơn" disabled
				><span class="icon-[fa7-solid--scroll]"></span> Hóa đơn
			</button>
			<button class="btn btn-sm btn-info" aria-label="Theo dõi đơn hàng" disabled>
				<span class="icon-[fa7-solid--location]"></span>Theo dõi đơn hàng
			</button>
		</AnimatedDiv>
	</div>
	<div class="mb-2 flex items-center gap-4">
		<p class="text-xs text-base-content/70">Ngày đặt hàng: {formatDate(order.createdAt)}</p>
	</div>

	<!-- Order Status Steps -->
	<AnimatedDiv
		animateVars={{ translatey: 16, delay: 0.1 }}
		class="mb-2 flex flex-col items-center rounded-box border bg-base-100 p-4"
	>
		<h3 class="mb-4 text-lg font-bold">Trạng thái đơn hàng</h3>
		<StatusSteps
			options={orderStatusOptions}
			status={order.status}
			icons={{
				Pending: 'icon-[mingcute--time-duration-line]',
				Paid: 'icon-[mingcute--cash-line]',
				Processing: 'icon-[mingcute--package-2-line]',
				Shipping: 'icon-[mingcute--truck-line]',
				Completed: 'icon-[mingcute--check-circle-line]',
				Cancelled: 'icon-[mingcute--forbid-circle-line]',
				Refunded: 'icon-[mingcute--card-refund-line]',
				PaymentFailed: 'icon-[mingcute--close-circle-line]'
			}}
			getStepClass={getOrderStatusStepClass}
		/>
	</AnimatedDiv>

	<!-- Product List Section -->
	<AnimatedDiv
		animateVars={{ translatey: 16, delay: 0.15 }}
		class="mb-2 rounded-box border bg-base-100 p-4"
	>
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
	</AnimatedDiv>

	<!-- Add this after your order details section -->
	<section class="mb-6">
		<div class="grid grid-cols-3 gap-2 max-md:grid-cols-1">
			<!-- Order Summary -->
			<AnimatedDiv
				animateVars={{ translateY: 16, delay: 0.2 }}
				class="rounded-box border bg-base-100 p-4"
			>
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
						<span class="font-serif text-2xl text-primary-content">{formatVND(order.total)}</span>
					</div>
				</div>
			</AnimatedDiv>

			<!-- Delivery Info -->
			<AnimatedDiv
				animateVars={{ translateY: 16, delay: 0.25 }}
				class="rounded-box border bg-base-100 p-4"
			>
				<h2 class="mb-2 text-lg font-bold">Thông tin giao hàng</h2>
				<div class="flex flex-col gap-2">
					{#if shipmentStatus === 'InTransit'}
						<p class="mb-4 flex items-center gap-2 text-success-content">
							<span class="icon-[fa7-solid--plane]"></span>
							Dự kiến giao:
							<span class="text-info-content italic"
								>{order.estimatedDelivery
									? formatDate(order.estimatedDelivery)
									: '3 - 5 ngày kể từ khi vận chuyển'}</span
							>
						</p>{/if}
					<StatusSteps
						options={shipmentStatusOptions}
						status={shipmentStatus}
						icons={{
							Ready: 'icon-[mingcute--package-2-line]',
							InTransit: 'icon-[mingcute--truck-line]',
							Delivered: 'icon-[mingcute--home-3-line]',
							Returned: 'icon-[mingcute--back-line]'
						}}
						getStepClass={getShipmentStatusStepClass}
					/>
					<div class="divider"></div>
					<p><span class="font-semibold">Người nhận:</span> {order.shipToName}</p>
					<p><span class="font-semibold">Số điện thoại:</span> {order.shipToPhone}</p>
					<p><span class="font-semibold">Địa chỉ:</span> {order.shipToAddress}</p>
				</div>
			</AnimatedDiv>

			<!-- Payment Info -->
			<AnimatedDiv
				animateVars={{ translateY: 16, delay: 0.3 }}
				class="rounded-box border bg-base-100 p-4"
			>
				<h2 class="mb-2 text-lg font-bold">Trạng thái thanh toán</h2>
				<span class={`mb-6 badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
					{getPaymentStatusTitle(order.paymentStatus)}
				</span>
				<StatusSteps
					options={paymentStatusOptions}
					status={order.paymentStatus}
					icons={{
						Pending: 'icon-[mingcute--time-line]',
						Paid: 'icon-[mingcute--cash-line]',
						Failed: 'icon-[mingcute--forbid-circle-line]',
						Refunded: 'icon-[mingcute--card-refund-line]'
					}}
					getStepClass={getPaymentStatusStepClass}
				/>
				{#if order.paymentStatus === 'Pending'}
					<p class="flex items-center gap-2 text-sm text-primary-content">
						<span class="icon-[fa7-solid--circle-info]"></span>Sản phẩm cần được thanh toán ngay để
						đơn hàng được xử lý.
					</p>
					<a href="/orders/payment/{order.id}" class="btn mt-2 btn-block btn-primary"
						>Tiến hành thanh toán</a
					>
				{/if}
			</AnimatedDiv>
		</div>
	</section>
{:else}
	<EmptyPlaceholder
		icon="icon-[fa7-solid--box-open]"
		text="Không tìm thấy đơn hàng, Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
		description="Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
	/>
{/if}
