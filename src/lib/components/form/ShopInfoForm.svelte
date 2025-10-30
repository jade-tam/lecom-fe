<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { updateShopSchema, type UpdateShopSchema } from '$lib/schemas/updateShopSchema';
	import type { Shop } from '$lib/types/Shop';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import ShopFrontPage from '../layout/ShopFrontPage.svelte';
	import FormMediaInput from '../ui/FormMediaInput.svelte';

	const {
		dataForm,
		shop
	}: {
		dataForm: any;
		shop: Shop;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset } =
		superForm<UpdateShopSchema, ToastData>(dataForm, {
			dataType: 'json',
			validators: zod4Client(updateShopSchema),
			onUpdated: ({ form }) => {
				if (form.message?.type === 'success') {
					goto('/seller/my-shop');
				}
			}
		});

	$inspect($form);

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<form method="POST" class="flex flex-col" use:enhance>
	<div class="my-2 flex items-center gap-4">
		<a href="/seller/my-shop" aria-label="return to category list" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Update Shop Profile</h1>
			<p class="text-base-content/60">Customize your shop's look, feel, and contact information.</p>
		</div>

		<div class="ml-auto flex items-center gap-2">
			<button
				class="btn btn-secondary"
				type="button"
				name="status"
				value="Draft"
				onclick={() => reset()}
				disabled={$submitting}
			>
				Reset
			</button>
			<button
				class="btn btn-primary"
				type="submit"
				name="status"
				value="Published"
				disabled={$submitting}
			>
				Save Changes
				{#if $delayed}
					<span class="loading loading-infinity"></span>
				{/if}
			</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col gap-4">
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Visual Branding</h1>
				</div>
				<div class="flex w-full gap-4">
					<FormMediaInput
						label="Shop Avatar"
						aspectRatio="1:1"
						buttonClass="rounded-full h-24 w-24"
						name="shopAvatar"
						superForm={form}
						{errors}
					/>
					<FormMediaInput
						label="Shop Banner"
						aspectRatio="16:9"
						class="h-32 w-full"
						name="shopBanner"
						superForm={form}
						{errors}
					/>
				</div>
			</div>
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Shop Information</h1>
				</div>
				<FormInput
					name="name"
					label="Shop Name"
					placeholder="Enter name here..."
					type="text"
					superForm={form}
					{errors}
				/>
				<FormTextArea
					name="description"
					label="Shop Description"
					placeholder="Enter description here..."
					superForm={form}
					{errors}
				/>
			</div>
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Contact Information</h1>
				</div>
				<FormInput
					name="phoneNumber"
					label="Phone Number"
					placeholder="Enter phone number here..."
					type="text"
					superForm={form}
					{errors}
				/>
				<FormInput
					name="address"
					label="Address"
					placeholder="Enter address here..."
					type="text"
					superForm={form}
					{errors}
				/>
			</div>
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Social Media Links</h1>
				</div>
				<FormInput
					name="shopFacebook"
					label="Facebook URL"
					placeholder="Enter url here..."
					type="text"
					icon="icon-[fa7-solid--link]"
					superForm={form}
					{errors}
				/>
				<FormInput
					name="shopInstagram"
					label="Instagram URL"
					placeholder="Enter url here..."
					type="text"
					icon="icon-[fa7-solid--link]"
					superForm={form}
					{errors}
				/>
				<FormInput
					name="shopTiktok"
					label="Tiktok URL"
					placeholder="Enter url here..."
					type="text"
					icon="icon-[fa7-solid--link]"
					superForm={form}
					{errors}
				/>
			</div>
		</div>

		<!-- ============================================================== -->

		<div class="rounded-box border bg-base-100 p-4 h-fit">
			<div class="flex items-center justify-between">
				<h1 class="text-header3 font-bold">Live Preview</h1>
			</div>

			<ShopFrontPage shop={{ ...shop, ...$form }} />
		</div>
	</div>
</form>
