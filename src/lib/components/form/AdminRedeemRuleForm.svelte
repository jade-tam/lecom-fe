<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import { createRedeemRuleSchema, updateRedeemRuleSchema } from '$lib/schemas/redeemRewardSchema';
	import { discountTypeOptions, type Voucher } from '$lib/types/Voucher';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormSelect, { type FormSelectOption } from '../ui/FormSelect.svelte';
	import ToolTip from '../ui/ToolTip.svelte';

	const {
		dataForm,
		isEdit = false,
		vouchersPromise
	}: {
		dataForm: Record<string, any>;
		isEdit?: boolean;
		vouchersPromise?: Promise<Voucher[]>;
	} = $props();

	const schema = isEdit ? updateRedeemRuleSchema : createRedeemRuleSchema;

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm(dataForm, {
			validators: zod4Client(schema)
		});
	let isLoading = $state(true);
	let voucherOptions = $state<FormSelectOption[]>([]);

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);

			if ($message.toastData.type === 'success') {
				goto(resolve('/admin/redeem-rule-config'));
			}
		}
	});

	$effect(() => {
		const setVoucherOptions = async () => {
			const vouchers = await vouchersPromise;
			if (!vouchers) return;

			// Map discountType to its title
			function getDiscountTypeTitle(type: string) {
				const found = discountTypeOptions.find((opt) => opt.value === type);
				return found ? found.title : type;
			}

			// Format discountValue with postfix
			function formatDiscountValue(type: string, value: number) {
				return type === 'Percentage' ? `${value}%` : `${value.toLocaleString()}₫`;
			}

			voucherOptions = vouchers.map((voucher) => ({
				title: `${voucher.code} - ${getDiscountTypeTitle(voucher.discountType)} - ${formatDiscountValue(voucher.discountType, voucher.discountValue)}`,
				value: voucher.code
			}));
			isLoading = false;
		};

		setVoucherOptions();
	});
</script>

<form method="POST" class="mx-auto max-w-lg rounded-box border bg-base-100 p-4" use:enhance>
	<div class="grid grid-cols-1 gap-x-4 gap-y-0">
		{#if isEdit}
			<FormInput
				name="id"
				label="ID mục đổi thưởng"
				placeholder="ID mục đổi thưởng..."
				type="text"
				superForm={form}
				{errors}
				readonly
				hidden
			/>
		{/if}

		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend"
				>Loại phần thưởng
				<ToolTip tip="Phiếu giảm giá hoặc công cụ hỗ trợ học tập" />
			</legend>

			<select class="select w-full" value="Voucher" disabled>
				<option disabled selected value={''}>Lựa chọn</option>
				<option value="Voucher">Phiếu giảm giá</option>
			</select>
		</fieldset>

		{#if isLoading}
			<p class="mt-2 text-xs font-semibold">Đang tải phiếu giảm giá...</p>
			<div class="mt-2 h-8 skeleton rounded-field"></div>
		{:else}
			<FormSelect
				options={voucherOptions}
				class="w-full"
				name="reward"
				label="Phiếu giảm giá"
				help="Chọn phiếu giảm giá người dùng có thể đổi"
				superForm={form}
				{errors}
				disabled={isEdit}
			/>
		{/if}

		<FormInput
			name="costPoints"
			label="Giá xu"
			help="Số xu cần dùng để đổi thưởng"
			icon="icon-[mingcute--copper-coin-fill] text-primary"
			placeholder="Nhập số xu cần để đổi thưởng..."
			type="number"
			superForm={form}
			{errors}
		/>

		<fieldset class="mt-2 fieldset">
			<legend class="fieldset-legend">Trạng thái kích hoạt</legend>
			<div class="flex items-center gap-4">
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="active"
						value={true}
						bind:group={$form.active}
						checked={$form.active === true}
						class="radio radio-success"
					/>
					<span>Kích hoạt</span>
				</label>
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="active"
						value={false}
						bind:group={$form.active}
						checked={$form.active === false}
						class="radio radio-error"
					/>
					<span>Vô hiệu hóa</span>
				</label>
			</div>
			{#if $errors['active']}
				{#each $errors['active'] as string[] as error}
					<p class="text-error">{error}</p>
				{/each}
			{/if}
		</fieldset>
	</div>

	<button class="btn mt-6 w-full btn-primary" type="submit" disabled={isLoading || $submitting}>
		{isEdit ? 'Cập nhật mục đổi thưởng' : 'Tạo mục đổi thưởng'}
		{#if $delayed}
			<span class="loading loading-md loading-infinity"></span>
		{/if}
	</button>
</form>
