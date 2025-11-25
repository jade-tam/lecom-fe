<script lang="ts">
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { paymentMethodOptions } from '$lib/types/OrderPaymentGroup';
	import { formatVND } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';

	const { data } = $props();
	const group = $derived(data.orderPaymentGroup);

	function getPaymentMethodTitle(method: string) {
		const found = paymentMethodOptions.find((opt) => opt.value === method);
		return found ? found.title : method;
	}

	let isPaymentUrlOpened = $state(false);
</script>

<h1 class="my-2 text-center text-2xl font-bold">Thanh toán đơn hàng</h1>

{#if group}
	<section class="mb-2 rounded-box border bg-base-100 p-4">
		<h2 class="mb-2 text-lg font-bold">Danh sách đơn hàng</h2>
		<div class="flex flex-col gap-4">
			{#each group.orders as order (order.id)}
				<div class="flex flex-col gap-2 rounded-box bg-base-200 p-4">
					<div class="flex items-center justify-between">
						<p class="flex items-center gap-2 font-semibold">
							<span class="icon-[fa7-solid--store] text-xl"></span>
							<span class="font-bold">Cửa hàng:</span>
							<span>{order.shopName}</span>
						</p>
						<p class="flex items-center gap-2 font-semibold">
							<span class="icon-[fa7-solid--barcode] text-xl"></span>
							<span class="font-bold">Mã đơn hàng:</span>
							<span>{order.orderCode}</span>
						</p>
					</div>
					<div class="flex flex-col gap-2">
						{#each order.details as item (item.id)}
							<div class="flex w-full flex-col gap-2 border-b pb-2 last:border-b-0 last:pb-0">
								<div class="flex w-full gap-4">
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
							</div>
						{/each}
					</div>

					<div class="divider mt-2 mb-0"></div>
					<!-- Tổng phí sản phẩm và phí vận chuyển -->
					<div class="flex justify-end gap-8">
						<div class="flex flex-col items-end">
							<span class="text-sm text-base-content/70">Tổng phí sản phẩm</span>
							<span class="font-serif font-bold text-primary-content"
								>{formatVND(order.subtotal)}</span
							>
						</div>
						<div class="flex flex-col items-end">
							<span class="text-sm text-base-content/70">Phí vận chuyển</span>
							<span class="font-serif font-bold text-info-content"
								>{formatVND(order.shippingFee)}</span
							>
						</div>
						<div class="flex flex-col items-end">
							<span class="text-sm text-base-content/70">Giảm giá áp dụng </span>
							<span class="font-serif font-bold text-success-content"
								>- {formatVND(order.discount)}</span
							>
							{#if group.voucherCodeUsed}
								<span class="mt-1 badge badge-xs font-serif font-black badge-success"
									>{group.voucherCodeUsed}</span
								>
							{/if}
						</div>
						<div class="divider mx-0 divider-horizontal"></div>
						<div class="flex flex-col items-end">
							<span class="text-sm text-base-content/70">Tổng đơn hàng</span>
							<span class="font-serif text-2xl font-bold text-primary-content"
								>{formatVND(order.total)}</span
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="mb-2 rounded-box border bg-base-100 p-4">
		<h2 class="mb-2 text-lg font-bold">Thông tin thanh toán</h2>
		<div class="flex flex-col gap-2">
			<div class="flex justify-between">
				<span>Tổng tiền đơn hàng</span>
				<span class="font-serif font-bold">{formatVND(group.totalAmount)}</span>
			</div>
			<div class="flex justify-between">
				<span>Phương thức thanh toán</span>
				<span class="font-serif font-bold">{getPaymentMethodTitle(group.paymentMethod)}</span>
			</div>
			<div class="flex justify-between">
				<span>Số dư ví sử dụng</span>
				<span class="font-serif font-bold">{formatVND(group.walletAmountUsed)}</span>
			</div>
			<div class="divider my-2"></div>
			<div class="flex justify-between">
				<span>Số dư cần thanh toán</span>
				<span class="font-serif text-2xl font-bold text-primary-content"
					>{formatVND(group.payOSAmountRequired)}</span
				>
			</div>
		</div>
	</section>

	<div class="mb-16 flex justify-center gap-2">
		<a
			href={group.paymentUrl}
			onclick={() => (isPaymentUrlOpened = true)}
			target="_blank"
			class="btn grow btn-primary"
			>Đi tới trang thanh toán <span class="icon-[mingcute--external-link-line]"></span></a
		>
		{#if isPaymentUrlOpened}<a
				href={group.orders[0] ? `/orders/${group.orders[0].id}` : '/orders'}
				class="btn grow btn-secondary"
				>Đã thanh toán? kiểm tra trạng thái đơn<span class="icon-[mingcute--checks-line]"></span></a
			>
		{/if}
	</div>
{:else}
	<EmptyPlaceholder
		text="Không tìm thấy thông tin thanh toán"
		description="Vui lòng kiểm tra lại liên kết hoặc liên hệ bộ phận hỗ trợ khách hàng."
		icon="icon-[fa7-solid--credit-card]"
	/>
{/if}
