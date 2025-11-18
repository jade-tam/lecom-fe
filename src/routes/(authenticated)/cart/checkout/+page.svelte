<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { SELECTED_CART_SESSION } from '$lib/consts/contexts';
	import { checkoutSchema, type CheckoutSchema } from '$lib/schemas/checkoutSchema';
	import type { Cart } from '$lib/types/Cart.js';
	import { paymentMethodOptions, type OrderPaymentGroup } from '$lib/types/OrderPaymentGroup';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import OrderSummary from '../(components)/OrderSummary.svelte';
	import { formatVND } from '$lib/utils/converters';

	const { data } = $props();

	let selectedCart: Cart | null = $state(null);

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CheckoutSchema,
			{
				toastData: ToastData;
				responseResult: OrderPaymentGroup;
			}
		>(data.checkoutForm, {
			validators: zod4Client(checkoutSchema),
			onUpdated: ({ form }) => {
				if (form.message?.toastData) showToast(form.message.toastData);
				if (form.message?.toastData.type === 'success') {
					goto(resolve(`/orders/payment/${form.message.responseResult.orders[0].id}`));
				}
			}
		});

	$effect(() => {
		$form.selectedProductIds = selectedCart
			? selectedCart.items.flatMap((group) => group.items.map((item) => item.productId))
			: [];
	});

	onMount(() => {
		const raw = sessionStorage.getItem(SELECTED_CART_SESSION);
		if (raw) {
			selectedCart = JSON.parse(raw);
		}
	});
</script>

<h1 class="my-2 text-center">Thông tin thanh toán</h1>
<form method="POST" class="h-fit w-full" use:enhance action="?/checkout">
	{#if selectedCart}
		<div class="grid grid-cols-12 gap-2 max-md:grid-cols-1">
			<div class="col-span-8 flex h-fit flex-col gap-2 max-md:col-span-1">
				<div class="rounded-box border bg-base-100 p-4">
					<h1 class="text-header3 mb-2 font-bold">Thông tin nhận hàng</h1>

					<FormInput
						name="shipToName"
						label="Tên người nhận"
						placeholder="Nhập tên người nhận"
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="shipToPhone"
						label="Số điện thoại"
						placeholder="Nhập số điện thoại"
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="shipToAddress"
						label="Địa chỉ nhận hàng"
						placeholder="Nhập địa chỉ nhận hàng"
						type="text"
						superForm={form}
						{errors}
					/>

					<FormTextArea
						name="note"
						label="Ghi chú"
						placeholder="Thêm ghi chú (không bắt buộc)"
						superForm={form}
						{errors}
					/>
				</div>
				<div class="rounded-box border bg-base-100 p-4">
					<div class="flex items-center justify-between">
						<h1 class="text-header3 mb-2 font-bold">Phương thức thanh toán</h1>
						<p class="flex items-center gap-2">
							<span class="icon-[fa7-solid--wallet] text-success-content"></span>Số dư ví:
							{#await data.balancePromise then userBalance}
								{#if userBalance}
									<span class="font-serif text-xl font-bold text-success-content"
										>{formatVND(userBalance.balance)} đ</span
									>
								{/if}
								<span class="text-error">Không thể lấy số dư ví</span>
							{/await}
						</p>
					</div>
					<FormSelect
						name="paymentMethod"
						label="Chọn phương thức thanh toán"
						options={paymentMethodOptions}
						superForm={form}
						{errors}
					/>

					<FormInput
						name="voucherCode"
						label="Mã giảm giá"
						placeholder="Nhập mã giảm giá (không bắt buộc)"
						type="text"
						superForm={form}
						{errors}
					/>
				</div>
			</div>

			<div class="col-span-4 h-fit rounded-box border bg-base-100 p-4 max-md:col-span-1">
				<OrderSummary {selectedCart} />

				<button
					class="btn mt-4 btn-block btn-primary"
					type="submit"
					disabled={$submitting || !isTainted($tainted)}
				>
					Xác nhận thanh toán
					{#if $delayed}
						<span class="loading loading-infinity"></span>
					{/if}
				</button>

				<FormInput
					hidden
					name="walletAmountToUse"
					label="Số dư ví sử dụng"
					placeholder="0"
					type="number"
					superForm={form}
					{errors}
				/>

				{#each $form.selectedProductIds as id}
					<input type="hidden" name="selectedProductIds" value={id} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center">
			<EmptyPlaceholder
				icon="icon-[fa7-solid--hourglass-end]"
				text="Phiên thanh toán đã hết hạn"
				class="h-32"
			/>
			<a href="/cart" class="btn btn-primary">Quay lại giỏ hàng</a>
		</div>
	{/if}
</form>
