<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import { createVoucherSchema, type CreateVoucherSchema } from '$lib/schemas/voucherSchema';
	import { discountTypeOptions } from '$lib/types/Voucher';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import ToolTip from '../ui/ToolTip.svelte';

	const { dataForm } = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CreateVoucherSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			validators: zod4Client(createVoucherSchema)
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);

			if ($message.toastData.type === 'success') {
				goto('/admin/vouchers');
			}
		}
	});
</script>

<form method="POST" class="rounded-box border bg-base-100 p-4" use:enhance>
	<div class="grid grid-cols-2 gap-x-4 gap-y-2 max-md:grid-cols-1">
		<div class="col-span-2 max-md:col-span-1">
			<fieldset class="fieldset max-w-64">
				<legend class="fieldset-legend"
					>Mã phiếu giảm giá
					<ToolTip tip="Mã phiếu giảm giá là mã duy nhất để nhận diện voucher." />
				</legend>
				<label class="input input-xl w-full">
					<span class={`icon-[mingcute--barcode-fill] text-3xl text-secondary-content`}></span>
					<input
						name="code"
						class="font-serif font-black"
						bind:value={$form['code']}
						placeholder="XXXXXXXX"
						oninput={(e) => ($form['code'] = (e.target as HTMLInputElement).value.toUpperCase())}
					/>
				</label>
				{#if $errors['code']}
					{#each $errors['code'] as string[] as error}
						<p class="text-error">{error}</p>
					{/each}
				{/if}
			</fieldset>
		</div>

		<FormSelect
			name="discountType"
			label="Loại giảm giá"
			options={discountTypeOptions}
			superForm={form}
			{errors}
		/>

		<FormInput
			name="discountValue"
			label="Giá trị giảm"
			help="Nhập giá trị giảm tương ứng với loại giảm giá đã chọn, theo x% hoặc xxxxxVND."
			placeholder="Nhập giá trị giảm..."
			postfix={$form.discountType === 'Percentage' ? '%' : 'đ'}
			type="number"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="maxDiscountAmount"
			label="Giá trị giảm tối đa"
			placeholder="Nhập số tiền giảm tối đa..."
			postfix="đ"
			type="number"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="minOrderAmount"
			label="Giá trị đơn tối thiểu"
			placeholder="Nhập giá trị đơn tối thiểu..."
			type="number"
			postfix="đ"
			superForm={form}
			{errors}
		/>
		<FormInput
			name="usageLimitPerUser"
			label="Giới hạn sử dụng mỗi người"
			placeholder="Nhập số lần sử dụng tối đa mỗi người..."
			type="number"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="quantityAvailable"
			label="Số lượng mã"
			placeholder="Nhập số lượng voucher..."
			type="number"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="startDate"
			label="Ngày bắt đầu"
			placeholder="Chọn ngày bắt đầu"
			type="date"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="endDate"
			label="Ngày kết thúc"
			placeholder="Chọn ngày kết thúc"
			type="date"
			superForm={form}
			{errors}
		/>

		<fieldset class="mt-2 fieldset">
			<legend class="fieldset-legend">Trạng thái kích hoạt</legend>
			<div class="flex items-center gap-4">
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="isActive"
						value={true}
						bind:group={$form.isActive}
						checked={$form.isActive === true}
						class="radio radio-success"
					/>
					<span>Kích hoạt</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="isActive"
						value={false}
						bind:group={$form.isActive}
						checked={$form.isActive === false}
						class="radio radio-error"
					/>
					<span>Vô hiệu hóa</span>
				</label>
			</div>
			{#if $errors['isActive']}
				{#each $errors['isActive'] as string[] as error}
					<p class="text-error">{error}</p>
				{/each}
			{/if}
		</fieldset>
	</div>

	<button class="btn mt-6 w-full btn-primary" type="submit" disabled={$submitting}>
		Tạo voucher
		{#if $delayed}
			<span class="loading loading-md loading-infinity"></span>
		{/if}
	</button>
</form>
