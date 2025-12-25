<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import StatusSteps from '$lib/components/ui/StatusSteps.svelte';
	import ToolTip from '$lib/components/ui/ToolTip.svelte';
	import {
		orderStatusOptions,
		paymentStatusOptions,
		shipmentStatusOptions,
		type Order,
		type OrderStatus,
		type ShipmentStatus
	} from '$lib/types/Order';
	import {
		getOrderStatusBadgeClass,
		getOrderStatusStepClass,
		getPaymentStatusBadgeClass,
		getPaymentStatusStepClass,
		getShipmentStatusStepClass
	} from '$lib/utils/classComposer';
	import { formatDate, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';
	import AnimatedDiv from '../animate/AnimatedDiv.svelte';
	import CancelOrderModalContent from '../modal/CancelOrderModalContent.svelte';
	import CreateProductFeedbackModalContent from '../modal/CreateProductFeedbackModalContent.svelte';
	import OpenModalButton from '../modal/OpenModalButton.svelte';
	import RefundModalContent from '../modal/RefundModalContent.svelte';
	import FormConfirmPopoverButton from '../wrapper/FormConfirmPopoverButton.svelte';

	const {
		order,
		isSellerView = false,
		refundFormData,
		cancelOrderFormData,
		createProductFeedbackFormData
	}: {
		order: Order;
		isSellerView?: boolean;
		refundFormData?: any;
		cancelOrderFormData: any;
		createProductFeedbackFormData?: any;
	} = $props();

	const shipmentStatus: ShipmentStatus = $derived.by(() => {
		switch (order?.status) {
			case 'Pending':
			case 'Paid':
			case 'Processing':
				// case 'PaymentFailed':
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

	const allowCancelStatuses: OrderStatus[] = ['Pending', 'Paid', 'Processing'];

	function handleBack() {
		history.back();
	}
</script>

<!-- Top section like the image -->
<div class="mt-2 mb-2 flex flex-wrap items-center justify-between gap-4">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex items-center gap-4">
		<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
			<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
		</button>
		<h1 class="text-2xl font-bold">
			Mã đơn hàng: {order.orderCode}
		</h1>
		<span class={`ml-2 badge shrink-0 ${getOrderStatusBadgeClass(order.status)}`}>
			{getTitleFromOptionList(order.status, orderStatusOptions)}
		</span>
	</AnimatedDiv>
	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex items-center gap-2">
		<button class="btn btn-sm btn-secondary" aria-label="Hóa đơn" disabled
			><span class="icon-[fa7-solid--scroll]"></span> Hóa đơn
		</button>
		<button class="btn btn-sm btn-info" aria-label="Theo dõi đơn hàng" disabled>
			<span class="icon-[fa7-solid--location]"></span>Theo dõi đơn hàng
		</button>
		{#if isSellerView && order.status === 'Paid'}
			<FormConfirmPopoverButton
				popoverId="confirm-process-order-popover"
				action="?/updateStatusSeller"
				openButtonProps={{
					type: 'button',
					class: 'btn btn-sm btn-secondary',
					'aria-label': 'Xác nhận đơn hàng'
				}}
				formData={{
					id: order.id,
					status: 'Processing'
				}}
				dropdownClass="dropdown-bottom dropdown-end"
				dropdownContent={{
					label: 'Xác nhận đơn hàng',
					description:
						'Sau khi đã xác nhận, khách hàng sẽ thấy đơn hàng được chuyển sang trạng thái chờ đóng gói.',
					confirmBtnClass: 'btn-secondary',
					confirmBtnIcon: 'icon-[mingcute--package-2-line]',
					confirmBtnText: 'Xác nhận'
				}}
			>
				<span class="icon-[mingcute--package-2-line]"></span>Xác nhận đơn hàng
			</FormConfirmPopoverButton>
		{/if}
		{#if isSellerView && order.status === 'Processing'}
			<FormConfirmPopoverButton
				popoverId="confirm-ship-order-popover"
				action="?/updateStatusSeller"
				openButtonProps={{ type: 'button', class: 'btn btn-sm btn-info' }}
				formData={{
					id: order.id,
					status: 'Shipping'
				}}
				dropdownClass="dropdown-bottom dropdown-end"
				dropdownContent={{
					label: 'Xác nhận đã gửi hàng',
					description: 'Đơn hàng sẽ được chuyển sang trạng thái đang vận chuyển.',
					confirmBtnClass: 'btn-info',
					confirmBtnIcon: 'icon-[mingcute--truck-line]',
					confirmBtnText: 'Xác nhận'
				}}
			>
				<span class="icon-[mingcute--truck-line]"></span>Xác nhận đã gửi hàng
			</FormConfirmPopoverButton>
		{/if}
		{#if !isSellerView && order.status === 'Shipping'}
			<FormConfirmPopoverButton
				popoverId="confirm-receive-order-popover"
				action="?/updateStatus"
				openButtonProps={{
					type: 'button',
					class: 'btn btn-sm btn-success',
					'aria-label': 'Xác nhận đã nhận hàng'
				}}
				formData={{
					id: order.id,
					status: 'Completed'
				}}
				dropdownClass="dropdown-bottom dropdown-end"
				dropdownContent={{
					label: 'Xác nhận đã nhận hàng',
					description:
						'Xác nhận bạn đã nhận được hàng. Nếu có vấn đề về đơn hàng, bạn có thể làm thủ tục trả hàng sau đó.',
					confirmBtnClass: 'btn-success',
					confirmBtnIcon: 'icon-[mingcute--check-circle-fill]',
					confirmBtnText: 'Xác nhận'
				}}
			>
				<span class="icon-[mingcute--check-circle-fill]"></span>Xác nhận đã nhận hàng
			</FormConfirmPopoverButton>
		{/if}
		{#if !isSellerView && order.status === 'Completed' && refundFormData}
			<OpenModalButton
				openButtonProps={{ class: 'btn btn-sm btn-error' }}
				ModalContent={RefundModalContent}
				ModalContentProps={{ dataForm: refundFormData }}
				><span class="icon-[mingcute--refresh-anticlockwise-1-line]"></span>Yêu cầu trả hàng hoàn
				tiền
			</OpenModalButton>
		{/if}
		{#if allowCancelStatuses.includes(order.status) && cancelOrderFormData}
			<OpenModalButton
				openButtonProps={{ class: 'btn btn-sm btn-error' }}
				ModalContent={CancelOrderModalContent}
				ModalContentProps={{ dataForm: cancelOrderFormData }}
				><span class="icon-[mingcute--close-circle-line]"></span>Huỷ đơn hàng
			</OpenModalButton>
		{/if}
	</AnimatedDiv>
</div>
<div class="mb-2 flex items-center gap-4">
	<p class="text-xs text-base-content/70">Ngày đặt hàng: {formatDate(order.createdAt)}</p>
</div>

<!-- Order Status Steps -->
<AnimatedDiv
	animateVars={{ translateY: 16, delay: 0.1 }}
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
	animateVars={{ translateY: 16, delay: 0.15 }}
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
				{#if order.status === 'Completed' && createProductFeedbackFormData}
					<OpenModalButton
						openButtonProps={{ class: 'btn btn-sm btn-warning' }}
						ModalContent={CreateProductFeedbackModalContent}
						ModalContentProps={{ dataForm: createProductFeedbackFormData, orderDetail: item }}
						><span class="icon-[mingcute--star-line]"></span>Đánh giá sản phẩm
					</OpenModalButton>
				{/if}
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
					<span class="font-serif text-info-content">{formatVND(order.shippingFee)}</span>
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
								: order.estimatedDeliveryText + ' kể từ khi vận chuyển'}</span
						>
					</p>{/if}
				<StatusSteps
					options={shipmentStatusOptions}
					status={shipmentStatus}
					icons={{
						Ready: 'icon-[mingcute--package-2-line]',
						InTransit: 'icon-[mingcute--truck-line]',
						Delivered: 'icon-[mingcute--home-3-line]',
						Returned: 'icon-[mingcute--refresh-anticlockwise-1-line]'
					}}
					getStepClass={getShipmentStatusStepClass}
				/>
				<div class="divider my-0"></div>
				<p class="text-sm"><span class="">Người nhận:</span> <strong>{order.shipToName}</strong></p>
				<p><span class="text-sm">Số điện thoại:</span> <strong>{order.shipToPhone}</strong></p>
				<p>
					<span class="text-sm">Địa chỉ:</span>
					<strong
						>{order.shipToAddress}, {order.toWardName}, {order.toDistrictName}, {order.toProvinceName}</strong
					>
				</p>
			</div>
		</AnimatedDiv>

		<!-- Payment Info -->
		<AnimatedDiv
			animateVars={{ translateY: 16, delay: 0.3 }}
			class="rounded-box border bg-base-100 p-4"
		>
			<h2 class="mb-2 text-lg font-bold">Trạng thái thanh toán</h2>
			<span class={`mb-6 badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
				{getTitleFromOptionList(order.paymentStatus, paymentStatusOptions)}
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
			{#if order.status === 'Pending'}
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
