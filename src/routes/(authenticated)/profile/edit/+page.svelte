<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormMediaInput from '$lib/components/ui/FormMediaInput.svelte';
	import {
		updateUserProfileSchema,
		type UpdateUserProfileSchema
	} from '$lib/schemas/updateUserProfileSchema.js';
	import type { ToastData } from '$lib/utils/showToast.js';
	import showToast from '$lib/utils/showToast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted } = superForm<
		UpdateUserProfileSchema,
		ToastData
	>(data.form, {
		validators: zod4Client(updateUserProfileSchema),
		resetForm: false
	});
	let formTaintedModal: HTMLDialogElement;

	$effect(() => {
		if ($message) {
			showToast($message);

			if ($message.type === 'success') {
				invalidateAll();
			}
		}
	});

	function handleCancel() {
		if (isTainted()) {
			formTaintedModal.showModal();
		} else {
			goto(resolve('/(authenticated)/profile'));
		}
	}
</script>

<!-- Form Tainted Modal -->
<dialog bind:this={formTaintedModal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Bạn muốn rời khỏi trang?</h3>
		<p class="py-4">Những thay đổi bạn làm có thể không được lưu.</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Không</button>
			</form>
			<a class="btn btn-error" href="/profile">Rời khỏi</a>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="mx-auto mt-4 max-w-2xl">
	<h1 class="text-header3 font-bold">Chỉnh sửa hồ sơ</h1>
	<p class="text-base-content/60">Cập nhật thông tin cá nhân của bạn bên dưới.</p>
</div>

<form
	method="POST"
	use:enhance
	action="?/updateProfile"
	class="mx-auto mt-2 flex max-w-2xl flex-col items-center gap-2 rounded-box border bg-base-100 p-8"
>
	<FormInput name="id" label="ID" type="text" superForm={form} hidden {errors} />

	<FormMediaInput
		label="Ảnh đại diện"
		aspectRatio="1:1"
		buttonClass="rounded-full h-28"
		name="imageUrl"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="fullName"
		label="Họ và tên"
		class="w-full"
		icon="icon-[fa7-solid--circle-user]"
		placeholder="Nhập họ và tên của bạn tại đây..."
		help="Họ và tên của bạn sẽ hiển thị trên thẻ CMND/CCCD"
		type="text"
		superForm={form}
		{errors}
	/>

	<div class="grid w-full grid-cols-2 gap-4 max-md:grid-cols-1">
		<FormInput
			name="userName"
			label="Tên đăng nhập"
			class="w-full"
			icon="icon-[fa7-solid--circle-user]"
			placeholder="Nhập tên đăng nhập của bạn tại đây..."
			help="Tên đăng nhập này sẽ được sử dụng để đăng nhập"
			type="text"
			superForm={form}
			{errors}
		/>
		<FormInput
			name="dateOfBirth"
			label="Ngày sinh"
			class="w-full"
			icon="icon-[fa7-solid--calendar-alt]"
			placeholder="Nhập ngày sinh của bạn tại đây..."
			type="date"
			superForm={form}
			{errors}
		/>
	</div>

	<FormInput
		name="phoneNumber"
		label="Số điện thoại"
		class="w-full"
		icon="icon-[fa7-solid--phone]"
		placeholder="Nhập số điện thoại của bạn tại đây..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="address"
		label="Địa chỉ"
		class="w-full"
		icon="icon-[fa7-solid--location-dot]"
		placeholder="Nhập địa chỉ của bạn tại đây..."
		type="text"
		superForm={form}
		{errors}
	/>

	<div class="mt-4 flex gap-2 self-end">
		<button class="btn btn-soft" type="button" onclick={handleCancel} disabled={$submitting}
			>Hủy</button
		>
		<button class="btn btn-primary" type="submit" disabled={$submitting || !isTainted($tainted)}>
			Lưu thay đổi
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
