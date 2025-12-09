<script lang="ts">
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { adminCreateBroadcastSchema } from '$lib/schemas/adminCreateBroadcastSchema';
	import { broadcastTypeOptions } from '$lib/types/Broadcast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormSelect from '../ui/FormSelect.svelte';

	const {
		dataForm,
	}: {
		dataForm: Record<string, any>;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm(dataForm, {
			validators: zod4Client(adminCreateBroadcastSchema)
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
		}
	});
</script>

<form method="POST" class="mx-auto max-w-lg rounded-box border bg-base-100 p-4" action="?/createBroadcast" use:enhance>
	<div class="grid grid-cols-1 gap-x-4 gap-y-0">
		<FormSelect
			name="type"
			options={broadcastTypeOptions}
			label="Loại thông báo"
			help="Chọn loại thông báo để gửi"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="title"
			label="Tiêu đề"
			help="Tiêu đề của thông báo"
			placeholder="Nhập tiêu đề..."
			type="text"
			superForm={form}
			{errors}
		/>

		<FormTextArea
			name="content"
			label="Nội dung"
			help="Nội dung chi tiết của thông báo"
			placeholder="Nhập nội dung..."
			superForm={form}
			{errors}
		/>
	</div>

	<button class="btn mt-6 w-full btn-primary" type="submit" disabled={$submitting}>
		Gửi thông báo
		{#if $delayed}
			<span class="loading loading-sm loading-infinity"></span>
		{/if}
	</button>
</form>
