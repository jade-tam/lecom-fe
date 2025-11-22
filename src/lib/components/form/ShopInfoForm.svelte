<script lang="ts">
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
			resetForm: false
		});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<form method="POST" class="flex flex-col" use:enhance>
	<div class="my-2 flex items-center gap-2">
		<a href="/seller/my-shop" aria-label="Quay lại danh sách cửa hàng" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Cập nhật hồ sơ cửa hàng</h1>
			<p class="text-base-content/60">
				Tùy chỉnh giao diện, thông tin liên hệ và mô tả cửa hàng của bạn.
			</p>
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
				Đặt lại
			</button>
			<button
				class="btn btn-primary"
				type="submit"
				name="status"
				value="Published"
				disabled={$submitting}
			>
				Lưu thay đổi
				{#if $delayed}
					<span class="loading loading-infinity"></span>
				{/if}
			</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div class="flex flex-col gap-2">
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Hình ảnh thương hiệu</h1>
				</div>
				<div class="flex w-full gap-4">
					<FormMediaInput
						label="Ảnh đại diện"
						aspectRatio="1:1"
						buttonClass="rounded-full h-24 w-24"
						name="shopAvatar"
						superForm={form}
						{errors}
					/>
					<FormMediaInput
						label="Ảnh banner"
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
					<h1 class="text-header3 font-bold">Thông tin cửa hàng</h1>
				</div>
				<FormInput
					name="name"
					label="Tên cửa hàng"
					placeholder="Nhập tên cửa hàng..."
					type="text"
					superForm={form}
					{errors}
				/>
				<FormTextArea
					name="description"
					label="Mô tả cửa hàng"
					placeholder="Nhập mô tả cửa hàng..."
					superForm={form}
					{errors}
				/>
			</div>
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Thông tin liên hệ</h1>
				</div>
				<FormInput
					name="phoneNumber"
					label="Số điện thoại"
					placeholder="Nhập số điện thoại..."
					type="text"
					superForm={form}
					{errors}
				/>
				<FormInput
					name="address"
					label="Địa chỉ"
					placeholder="Nhập địa chỉ..."
					type="text"
					superForm={form}
					{errors}
				/>
			</div>
			<div class="rounded-box border bg-base-100 p-4">
				<div class="flex items-center justify-between">
					<h1 class="text-header3 font-bold">Liên kết mạng xã hội</h1>
				</div>
				<FormInput
					name="shopFacebook"
					label="Địa chỉ Facebook"
					placeholder="Nhập url Facebook..."
					type="text"
					icon="icon-[fa7-solid--link]"
					superForm={form}
					{errors}
				/>
				<FormInput
					name="shopInstagram"
					label="Địa chỉ Instagram"
					placeholder="Nhập url Instagram..."
					type="text"
					icon="icon-[fa7-solid--link]"
					superForm={form}
					{errors}
				/>
				<FormInput
					name="shopTiktok"
					label="Địa chỉ Tiktok"
					placeholder="Nhập url Tiktok..."
					type="text"
					icon="icon-[fa7-solid--link]"
					superForm={form}
					{errors}
				/>
			</div>
		</div>

		<!-- ============================================================== -->

		<div class="h-fit rounded-box border bg-base-100 p-4">
			<div class="flex items-center justify-between">
				<h1 class="text-header3 font-bold">Xem trước</h1>
			</div>

			<ShopFrontPage shop={{ ...shop, ...$form }} products={[]} courses={[]} />
		</div>
	</div>
</form>
