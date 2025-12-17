<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import AddressSelectors from '$lib/components/ui/data-input/AddressSelectors.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormSelect, { type FormSelectOption } from '$lib/components/ui/FormSelect.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { SELECTED_CART_SESSION } from '$lib/consts/contexts';
	import { checkoutSchema, type CheckoutSchema } from '$lib/schemas/checkoutSchema';
	import type { Cart } from '$lib/types/Cart.js';
	import { shipmentTypeOptions } from '$lib/types/Order';
	import { paymentMethodOptions, type OrderPaymentGroup } from '$lib/types/OrderPaymentGroup';
	import { type Voucher } from '$lib/types/Voucher';
	import { formatVND, getVoucherTitle } from '$lib/utils/converters';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import OrderSummary from '../(components)/OrderSummary.svelte';

	const { data } = $props();

	let selectedCart: Cart | null = $state(null);
	let isLoadingVoucher = $state<boolean>(true);
	let myVouchers = $state<Voucher[]>([]);
	let voucherOptions: FormSelectOption[] = $derived(
		myVouchers.map((voucher) => ({
			title: getVoucherTitle(voucher),
			value: voucher.code
		}))
	);
	let isCheckoutReviewed = $state<boolean>(false);
	let shippingFee = $state<number | undefined>(undefined);

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CheckoutSchema,
			{
				toastData: ToastData;
				responseResult: OrderPaymentGroup;
			}
		>(data.checkoutForm, {
			validators: zod4Client(checkoutSchema),
			onChange: () => {
				isCheckoutReviewed = false;
				shippingFee = undefined;
			},
			onUpdated: ({ form }) => {
				if (form.message?.toastData) showToast(form.message.toastData);

				if (form.message?.toastData.type === 'success') {
					if (form.message?.responseResult.paymentUrl) {
						goto(resolve(`/orders/payment/${form.message.responseResult.orders[0].id}`));
					} else {
						goto(resolve(`/orders`));
					}
				}
			},
			onResult: ({ result }) => {
				if (result.type !== 'success') return;
				if (!result.data?.form.message) return;

				isCheckoutReviewed = true;
				shippingFee = result.data.form.message.responseResult.shippingFee;
			},
			resetForm: (() => isCheckoutReviewed)() ? true : false
		});

	$effect(() => {
		$form.selectedProductIds = selectedCart
			? selectedCart.items.flatMap((group) => group.items.map((item) => item.productId))
			: [];
	});

	$effect(() => {
		const setVoucherOptions = async () => {
			myVouchers = await data.myVouchersPromise;
			isLoadingVoucher = false;
		};

		setVoucherOptions();
	});

	$effect(() => {
		const setVoucherOptions = async () => {
			myVouchers = await data.myVouchersPromise;
			isLoadingVoucher = false;
		};

		setVoucherOptions();
	});

	onMount(() => {
		const raw = sessionStorage.getItem(SELECTED_CART_SESSION);
		if (raw) {
			selectedCart = JSON.parse(raw);
		}
	});
</script>

<AnimatedDiv animateVars={{ translateY: -16 }}>
	<h1 class="my-2 text-center">Thông tin thanh toán</h1>
</AnimatedDiv>

<form
	method="POST"
	class="h-fit w-full"
	use:enhance
	action={isCheckoutReviewed ? '?/checkout' : '?/preview'}
>
	{#if selectedCart}
		<div class="grid grid-cols-12 gap-2 max-md:grid-cols-1">
			<div class="col-span-8 flex h-fit flex-col gap-2 max-md:col-span-1">
				<AnimatedDiv
					animateVars={{ translateY: 16, delay: 0.1 }}
					class="rounded-box border bg-base-100 p-4"
				>
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

					<AddressSelectors
						{form}
						{errors}
						fieldNames={{
							provinceId: 'toProvinceId',
							provinceName: 'toProvinceName',
							districtId: 'toDistrictId',
							districtName: 'toDistrictName',
							wardCode: 'toWardCode',
							wardName: 'toWardName'
						}}
					/>

					<FormInput
						name="shipToAddress"
						label="Địa chỉ cụ thể"
						placeholder="Nhập địa chỉ nhận hàng cụ thể"
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
				</AnimatedDiv>
				<AnimatedDiv
					animateVars={{ translateY: 16, delay: 0.2 }}
					class="rounded-box border bg-base-100 p-4"
				>
					<div class="flex items-center justify-between">
						<h1 class="text-header3 mb-2 font-bold">Phương thức vận chuyển</h1>
					</div>
					<FormSelect
						name="serviceTypeId"
						label="Chọn phương thức vận chuyển"
						options={shipmentTypeOptions}
						superForm={form}
						{errors}
					/>
				</AnimatedDiv>
				<AnimatedDiv
					animateVars={{ translateY: 16, delay: 0.3 }}
					class="rounded-box border bg-base-100 p-4"
				>
					<div class="flex items-center justify-between">
						<h1 class="text-header3 mb-2 font-bold">Phương thức thanh toán</h1>
						<p class="flex items-center gap-2">
							<span class="icon-[fa7-solid--wallet] text-success-content"></span>Số dư ví:
							{#await data.balancePromise}
								<span class="loading loading-infinity"></span>
							{:then userBalance}
								{#if userBalance}
									<span class="mb-0.5 font-serif text-xl font-bold text-success-content"
										>{formatVND(userBalance.balance)}</span
									>
								{:else}
									<span class="text-error">Không thể lấy số dư ví</span>
								{/if}
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

					{#await data.balancePromise then userBalance}
						{#if userBalance !== null && $form['paymentMethod'] === 'wallet' && selectedCart.subtotal > userBalance.balance}
							<p class="mt-1 text-sm text-error">Số dư ví không đủ</p>
						{/if}
					{/await}

					{#if isLoadingVoucher}
						<p>Đang tải danh sách phiếu giảm giá <span class="loading loading-infinity"></span></p>
					{:else}
						<FormSelect
							options={[
								{
									title: 'Không sử dụng mã giảm giá',
									value: ''
								},
								...voucherOptions
							]}
							name="voucherCode"
							label="Mã giảm giá"
							superForm={form}
							placeholder={myVouchers.length
								? 'Chọn mã giảm giá (không bắt buộc)'
								: 'Bạn không có mã giảm giá nào'}
							{errors}
						/>
					{/if}
				</AnimatedDiv>
			</div>

			<div class="col-span-4 h-fit rounded-box border bg-base-100 p-4 max-md:col-span-1">
				<OrderSummary
					{selectedCart}
					selectedVoucher={myVouchers.find((v) => v.code === $form.voucherCode)}
					{shippingFee}
				/>

				{#if isCheckoutReviewed}
					<button class="btn mt-4 btn-block btn-primary" type="submit" disabled={$submitting}>
						Xác nhận thanh toán
						{#if $delayed}
							<span class="loading loading-infinity"></span>
						{/if}
					</button>
				{:else}
					<button
						class="btn mt-4 btn-block btn-info"
						type="submit"
						disabled={$submitting || !isTainted($tainted)}
					>
						Kiểm tra phí vận chuyển
						{#if $delayed}
							<span class="loading loading-infinity"></span>
						{/if}
					</button>
				{/if}

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
