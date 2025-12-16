<script lang="ts">
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { shopAddressSchema, type ShopAddressSchema } from '$lib/schemas/shopAddressSchema';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import AddressSelectors from '../ui/data-input/AddressSelectors.svelte';

	const {
		dataForm,
		mode,
		onFormActionSuccess
	}: {
		dataForm: any;
		mode: 'create' | 'update';
		onFormActionSuccess?: () => void;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, reset } = superForm<
		ShopAddressSchema,
		{
			toastData?: ToastData;
		}
	>(dataForm, {
		validators: zod4Client(shopAddressSchema),
		resetForm: false
	});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			onFormActionSuccess?.();
		}
	});
</script>

<form
	method="POST"
	class="flex flex-col gap-4"
	action="?/{mode === 'create' ? 'createAddress' : 'updateAddress'}"
	use:enhance
>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="rounded-box border bg-base-300/30 p-4">
			<h4 class="text-header4 mb-2 font-semibold">Khu vực</h4>
			<AddressSelectors {form} {errors} />
			<FormTextArea
				name="detailAddress"
				label="Địa chỉ chi tiết"
				placeholder="Số nhà, tên đường, khu vực cụ thể..."
				superForm={form}
				{errors}
			/>

			<div class="mt-2 w-fit text-sm">
				<!-- hidden input tobe submitted -->
				<input
					type="checkbox"
					name="isDefault"
					bind:checked={$form['isDefault']}
					class="checkbox"
					hidden
				/>
				<label class="flex items-center gap-2">
					<span>Đặt làm địa chỉ mặc định</span>
					<input
						type="checkbox"
						name="isDefaultForDisplay"
						bind:checked={$form['isDefault']}
						class="checkbox"
						disabled
					/>
				</label>
				{#if $errors['isDefault']}
					{#each $errors['isDefault'] as error}
						<p class="text-error">{error}</p>
					{/each}
				{/if}
			</div>
		</div>

		<div class="rounded-box border bg-base-300/30 p-4">
			<h4 class="text-header4 mb-2 font-semibold">Thông tin liên hệ</h4>
			<FormInput
				name="contactName"
				label="Tên người liên hệ"
				placeholder="Nhập tên người liên hệ..."
				type="text"
				superForm={form}
				{errors}
			/>
			<FormInput
				name="contactPhone"
				label="Số điện thoại liên hệ"
				placeholder="Nhập số điện thoại..."
				type="tel"
				superForm={form}
				{errors}
			/>
		</div>
	</div>

	<FormInput name="id" label="ID địa chỉ" type="text" superForm={form} {errors} hidden />

	<div class="flex justify-end gap-2">
		<button
			type="button"
			class="btn btn-secondary"
			disabled={$submitting || !$tainted}
			onclick={() => reset()}
		>
			<span class="icon-[mingcute--refresh-anticlockwise-1-fill] text-lg"></span>Đặt lại
		</button>
		<button type="submit" class="btn btn-primary" disabled={$submitting}>
			<span class="icon-[mingcute--save-2-line] text-xl"></span>{mode === 'create'
				? 'Thiết lập địa chỉ'
				: 'Lưu thay đổi'}
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
