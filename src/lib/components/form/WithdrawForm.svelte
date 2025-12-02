<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import { createWithdrawSchema, type CreateWithdrawSchema } from '$lib/schemas/withdrawSchema';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { dataForm } = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CreateWithdrawSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			validators: zod4Client(createWithdrawSchema)
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);

			if ($message.toastData.type === 'success') {
				goto(resolve('/seller/wallet/withdraw'));
			}
		}
	});
</script>

<form method="POST" class="rounded-box border bg-base-100 p-4" use:enhance>
	<div class="grid grid-cols-1 gap-x-4 gap-y-2">
		<FormInput
			name="amount"
			label="Số tiền rút"
			placeholder="Nhập số tiền muốn rút..."
			type="number"
			postfix="₫"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="bankName"
			label="Tên ngân hàng"
			placeholder="VD: BIDV, Vietcombank..."
			superForm={form}
			{errors}
		/>

		<FormInput
			name="bankAccountNumber"
			label="Số tài khoản ngân hàng"
			placeholder="Nhập số tài khoản..."
			superForm={form}
			{errors}
		/>

		<FormInput
			name="bankAccountName"
			label="Tên chủ tài khoản"
			placeholder="Nhập tên chủ tài khoản..."
			superForm={form}
			{errors}
		/>

		<FormInput
			name="bankBranch"
			label="Chi nhánh ngân hàng"
			placeholder="VD: BIDV - CN Gia Định"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="note"
			label="Ghi chú"
			placeholder="Thêm ghi chú (không bắt buộc)..."
			superForm={form}
			{errors}
		/>
	</div>

	<button class="btn mt-6 w-full btn-primary" type="submit" disabled={$submitting}>
		Tạo yêu cầu rút tiền
		{#if $delayed}
			<span class="loading loading-md loading-infinity"></span>
		{/if}
	</button>
</form>
