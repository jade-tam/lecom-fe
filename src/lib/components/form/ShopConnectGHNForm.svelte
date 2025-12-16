<script lang="ts">
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import {
		shopConnectGHNSchema,
		type ShopConnectGHNSchema
	} from '$lib/schemas/shopConnectGHNSchema';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { dataForm, onFormActionSuccess }: { dataForm: any; onFormActionSuccess?: () => void } =
		$props();

	const { form, errors, message, enhance, submitting, delayed, tainted, reset } = superForm<
		ShopConnectGHNSchema,
		{ toastData?: ToastData }
	>(dataForm, {
		validators: zod4Client(shopConnectGHNSchema),
		resetForm: false
	});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			onFormActionSuccess?.();
		}
	});
</script>

<form method="POST" class="flex flex-col gap-2" action="?/connectGHN" use:enhance>
	<FormInput
		name="ghnToken"
		label="API Token GHN"
		placeholder="Nhập API token GHN..."
		type="text"
		superForm={form}
		{errors}
	/>
	<FormInput
		name="ghnShopId"
		label="ID cửa hàng GHN"
		placeholder="Nhập ID cửa hàng từ GHN..."
		type="text"
		superForm={form}
		{errors}
	/>

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
			<span class="icon-[mingcute--link-3-fill] text-xl"></span>Kết nối với GHN
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
