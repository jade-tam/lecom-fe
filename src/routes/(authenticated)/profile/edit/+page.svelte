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
		<h3 class="text-lg font-bold">Do you want to leave?</h3>
		<p class="py-4">Changes you made may not be saved.</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Nope</button>
			</form>
			<a class="btn btn-error" href="/profile">Leave</a>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="mx-auto mt-4 max-w-2xl">
	<h1 class="text-header3 font-bold">Edit Profile</h1>
	<p class="text-base-content/60">Update your personal details below.</p>
</div>

<form
	method="POST"
	use:enhance
	action="?/updateProfile"
	class="mx-auto mt-2 flex max-w-2xl flex-col items-center gap-2 rounded-box border bg-base-100 p-8"
>
	<FormInput name="id" label="ID" type="text" superForm={form} hidden {errors} />

	<FormMediaInput
		label="Avatar"
		aspectRatio="1:1"
		buttonClass="rounded-full h-28"
		name="imageUrl"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="fullName"
		label="Full name"
		class="w-full"
		icon="icon-[fa7-solid--circle-user]"
		placeholder="Enter your full name here..."
		help="Your full name which show on your personal ID card"
		type="text"
		superForm={form}
		{errors}
	/>

	<div class="grid w-full grid-cols-2 gap-4 max-md:grid-cols-1">
		<FormInput
			name="userName"
			label="Username"
			class="w-full"
			icon="icon-[fa7-solid--circle-user]"
			placeholder="Enter your user name here..."
			help="This username will be used for login"
			type="text"
			superForm={form}
			{errors}
		/>
		<FormInput
			name="dateOfBirth"
			label="Date Of Birth"
			class="w-full"
			icon="icon-[fa7-solid--calendar-alt]"
			placeholder="Enter your date of birth here..."
			type="date"
			superForm={form}
			{errors}
		/>
	</div>

	<FormInput
		name="phoneNumber"
		label="Phone Number"
		class="w-full"
		icon="icon-[fa7-solid--phone]"
		placeholder="Enter your phone number here..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="address"
		label="Address"
		class="w-full"
		icon="icon-[fa7-solid--location-dot]"
		placeholder="Enter your address here..."
		type="text"
		superForm={form}
		{errors}
	/>

	<div class="mt-4 flex gap-2 self-end">
		<button class="btn btn-soft" type="button" onclick={handleCancel} disabled={$submitting}
			>Cancel</button
		>
		<button class="btn btn-primary" type="submit" disabled={$submitting || !isTainted($tainted)}>
			Save changes
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
