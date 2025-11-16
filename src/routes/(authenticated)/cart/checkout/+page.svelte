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
	import { paymentMethodOptions, type OrderCheckout } from '$lib/types/OrderCheckout';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import OrderSummary from '../(components)/OrderSummary.svelte';

	const { data } = $props();

	let selectedCart: Cart | null = $state(null);

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CheckoutSchema,
			{
				toastData: ToastData;
				responseResult: OrderCheckout;
			}
		>(data.checkoutForm, {
			validators: zod4Client(checkoutSchema),
			onUpdated: ({ form }) => {
				if (form.message?.toastData) showToast(form.message.toastData);
				if (form.message?.toastData.type === 'success') {
					goto(resolve(`/orders/${form.message.responseResult.orders[0].id}`));
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

<h1 class="my-2 text-center">Checkout</h1>
<form method="POST" class="h-fit w-full" use:enhance action="?/checkout">
	{#if selectedCart}
		<div class="grid grid-cols-12 gap-4 max-md:grid-cols-1">
			<div class="col-span-8 flex h-fit flex-col gap-4 max-md:col-span-1">
				<div class="rounded-box border bg-base-100 p-4">
					<h1 class="text-header3 mb-2 font-bold">Checkout Information</h1>

					<FormInput
						name="shipToName"
						label="Recipient Name"
						placeholder="Enter recipient name"
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="shipToPhone"
						label="Phone Number"
						placeholder="Enter phone number"
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="shipToAddress"
						label="Shipping Address"
						placeholder="Enter shipping address"
						type="text"
						superForm={form}
						{errors}
					/>

					<FormTextArea
						name="note"
						label="Note"
						placeholder="Add a note (optional)"
						superForm={form}
						{errors}
					/>
				</div>
				<div class="rounded-box border bg-base-100 p-4">
					<h1 class="text-header3 mb-2 font-bold">Payment Option</h1>
					<FormSelect
						name="paymentMethod"
						label="Payment Method"
						options={paymentMethodOptions}
						superForm={form}
						{errors}
					/>

					<FormInput
						name="voucherCode"
						label="Voucher Code"
						placeholder="Enter voucher code (optional)"
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
					Checkout
					{#if $delayed}
						<span class="loading loading-infinity"></span>
					{/if}
				</button>

				<FormInput
					hidden
					name="walletAmountToUse"
					label="Wallet Amount to Use"
					placeholder="0"
					type="number"
					superForm={form}
					{errors}
				/>

				<FormInput
					hidden
					name="selectedProductIds"
					label="selectedProductIds"
					type="text"
					superForm={form}
					{errors}
				/>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center">
			<EmptyPlaceholder
				icon="icon-[fa7-solid--hourglass-end]"
				text="This checkout session has expired"
				class="h-32"
			/>
			<a href="/cart" class="btn btn-primary">Return to your cart</a>
		</div>
	{/if}
</form>
