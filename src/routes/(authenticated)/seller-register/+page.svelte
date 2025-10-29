<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormMediaInput from '$lib/components/ui/FormMediaInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import { shopBusinessOptions } from '$lib/consts/shopBusinessOptions.js';
	import { registerShopSchema, type RegisterShopSchema } from '$lib/schemas/registerShopSchema.js';
	import type { ToastData } from '$lib/utils/showToast.js';
	import showToast from '$lib/utils/showToast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<
		RegisterShopSchema,
		ToastData
	>(data.form, {
		validators: zod4Client(registerShopSchema),
		onUpdated: ({ form }) => {
			if (form.message?.type === 'success') {
				goto('/shop');
			}
		}
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<div class="my-2 flex justify-center">
	<h2>Register Shop Now</h2>
</div>

<!-- HERE IS THE FORM -->
<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 pt-2" use:enhance>
	<h3>Personal Information</h3>
	<FormInput
		name="ownerFullName"
		label="Full name"
		class="max-w-[400px]"
		icon="icon-[fa7-solid--circle-user]"
		placeholder="Enter your full name here..."
		help="Your full name which show on your personal ID card"
		type="text"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="ownerDateOfBirth"
		label="Date Of Birth"
		class="max-w-[400px]"
		placeholder="Enter your date of birth..."
		icon="icon-[fa7-solid--calendar-alt]"
		help="Must match the date that show on your personal ID card"
		type="date"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="ownerPersonalIdNumber"
		label="Personal ID Number"
		class="max-w-[400px]"
		placeholder="Enter your ID number..."
		icon="icon-[fa7-solid--id-card]"
		help="Must match the ID that show on your personal ID card"
		type="text"
		superForm={form}
		{errors}
	/>

	<div class="flex w-full gap-4">
		<FormMediaInput
			class="aspect-video"
			aspectRatio="16:9"
			name="ownerPersonalIdFrontUrl"
			label="Personal ID Front Image"
			icon="icon-[fa7-solid--image]"
			superForm={form}
			{errors}
		/>

		<FormMediaInput
			class="aspect-video"
			aspectRatio="16:9"
			name="ownerPersonalIdBackUrl"
			icon="icon-[fa7-solid--image]"
			label="Personal ID Back Image"
			superForm={form}
			{errors}
		/>
	</div>

	<div class="divider"></div>
	<h3>Shop Information</h3>

	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-4">
			<FormInput
				name="shopName"
				label="Shop Name"
				icon="icon-[fa7-solid--shop]"
				placeholder="Enter your shop name..."
				class="max-w-[400px]"
				type="text"
				superForm={form}
				{errors}
			/>

			<FormInput
				name="shopPhoneNumber"
				label="Shop Phone Number"
				class="max-w-[400px]"
				icon="icon-[fa7-solid--phone-square]"
				placeholder="This is your shop contact number..."
				type="text"
				superForm={form}
				{errors}
			/>
		</div>
		<div class="col-span-8 flex gap-4">
			<FormMediaInput
				aspectRatio="1:1"
				name="shopAvatar"
				label="Shop Avatar"
				class="h-39 w-38"
				icon="icon-[fa7-solid--image]"
				superForm={form}
				{errors}
			/>
			<FormMediaInput
				name="shopBanner"
				label="Shop Banner"
				class="h-39 w-full"
				icon="icon-[fa7-solid--image]"
				superForm={form}
				aspectRatio="16:9"
				{errors}
			/>
		</div>
	</div>

	<FormInput
		name="shopDescription"
		label="Shop Description"
		icon="icon-[fa7-solid--align-justify]"
		placeholder="Enter your shop description..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="shopAddress"
		label="Shop Address"
		icon="icon-[fa7-solid--location-dot]"
		placeholder="Where is your shop location..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormSelect
		name="businessType"
		options={shopBusinessOptions}
		icon="icon-[fa7-solid--briefcase]"
		class="max-w-[400px]"
		label="Shop Business Type"
		placeholder="Shop Business Type"
		superForm={form}
		{errors}
	/>

	<FormSelect
		name="categoryId"
		options={data.categories.map((cat) => ({
			title: cat.name,
			value: cat.id
		}))}
		class="max-w-[400px]"
		label="Shop Category"
		placeholder="Shop category"
		help="Products and courses on your shop will focus on this category"
		superForm={form}
		{errors}
	/>

	<FormMediaInput
		aspectRatio="16:9"
		buttonClass="max-h-32"
		mediaType="Document"
		name="ownershipDocumentUrl"
		label="Shop Ownership Document"
		placeholder="Upload document here"
		icon="icon-[fa7-solid--file-text]"
		help="Upload an official document proving ownership of your business — for example, a business registration certificate or store lease agreement. Accepted formats: DOC, DOCX, or PDF"
		superForm={form}
		{errors}
	/>

	<div class="my-2 text-right text-sm">
		<label class="flex items-center justify-end gap-2">
			<p>
				I confirm that the information provided is accurate and I also agree to the platform’s
				mentor policies and terms.
			</p>
			<input
				type="checkbox"
				name="acceptedTerms"
				bind:checked={$form['acceptedTerms']}
				class="checkbox"
			/>
		</label>
		{#if $errors['acceptedTerms']}
			{#each $errors['acceptedTerms'] as error}
				<p class="text-error">{error}</p>
			{/each}
		{/if}
	</div>

	<button class="btn mt-2 w-full btn-primary" disabled={$submitting}>
		Submit
		{#if $delayed}
			<span class="loading loading-spinner"></span>
		{/if}
	</button>
</form>
