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
				goto('/shopping');
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
	<h2>Đăng ký mở cửa hàng</h2>
</div>

<!-- FORM ĐĂNG KÝ -->
<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 pt-2" use:enhance>
	<h3>Thông tin cá nhân</h3>
	<FormInput
		name="ownerFullName"
		label="Họ và tên"
		class="max-w-[400px]"
		icon="icon-[fa7-solid--circle-user]"
		placeholder="Nhập họ và tên của bạn..."
		help="Họ và tên như trên giấy tờ tùy thân"
		type="text"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="ownerDateOfBirth"
		label="Ngày sinh"
		class="max-w-[400px]"
		placeholder="Nhập ngày sinh của bạn..."
		icon="icon-[fa7-solid--calendar-alt]"
		help="Phải trùng với ngày sinh trên giấy tờ tùy thân"
		type="date"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="ownerPersonalIdNumber"
		label="Số CMND/CCCD"
		class="max-w-[400px]"
		placeholder="Nhập số CMND/CCCD..."
		icon="icon-[fa7-solid--id-card]"
		help="Phải trùng với số trên giấy tờ tùy thân"
		type="text"
		superForm={form}
		{errors}
	/>

	<div class="flex w-full gap-4">
		<FormMediaInput
			class="aspect-video"
			aspectRatio="16:9"
			name="ownerPersonalIdFrontUrl"
			label="Ảnh mặt trước CMND/CCCD"
			icon="icon-[fa7-solid--image]"
			superForm={form}
			{errors}
		/>

		<FormMediaInput
			class="aspect-video"
			aspectRatio="16:9"
			name="ownerPersonalIdBackUrl"
			icon="icon-[fa7-solid--image]"
			label="Ảnh mặt sau CMND/CCCD"
			superForm={form}
			{errors}
		/>
	</div>

	<div class="divider"></div>
	<h3>Thông tin cửa hàng</h3>

	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-4">
			<FormInput
				name="shopName"
				label="Tên cửa hàng"
				icon="icon-[fa7-solid--shop]"
				placeholder="Nhập tên cửa hàng..."
				class="max-w-[400px]"
				type="text"
				superForm={form}
				{errors}
			/>

			<FormInput
				name="shopPhoneNumber"
				label="Số điện thoại cửa hàng"
				class="max-w-[400px]"
				icon="icon-[fa7-solid--phone-square]"
				placeholder="Số liên hệ cửa hàng..."
				type="text"
				superForm={form}
				{errors}
			/>
		</div>
		<div class="col-span-8 flex gap-4">
			<FormMediaInput
				aspectRatio="1:1"
				name="shopAvatar"
				label="Ảnh đại diện cửa hàng"
				class="h-39 w-38"
				icon="icon-[fa7-solid--image]"
				superForm={form}
				{errors}
			/>
			<FormMediaInput
				name="shopBanner"
				label="Ảnh banner cửa hàng"
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
		label="Mô tả cửa hàng"
		icon="icon-[fa7-solid--align-justify]"
		placeholder="Nhập mô tả cửa hàng..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormInput
		name="shopAddress"
		label="Địa chỉ cửa hàng"
		icon="icon-[fa7-solid--location-dot]"
		placeholder="Địa chỉ cửa hàng..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormSelect
		name="businessType"
		options={shopBusinessOptions}
		icon="icon-[fa7-solid--briefcase]"
		class="max-w-[400px]"
		label="Loại hình kinh doanh"
		placeholder="Chọn loại hình kinh doanh"
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
		label="Danh mục khoá học chính"
		placeholder="Chọn danh mục khoá học chính"
		help="Các khóa học của cửa hàng sẽ tập trung vào danh mục này"
		superForm={form}
		{errors}
	/>

	<FormMediaInput
		aspectRatio="16:9"
		buttonClass="max-h-32"
		mediaType="Document"
		name="ownershipDocumentUrl"
		label="Tài liệu sở hữu cửa hàng"
		placeholder="Tải lên tài liệu tại đây"
		icon="icon-[fa7-solid--file-text]"
		help="Tải lên giấy tờ chứng minh quyền sở hữu kinh doanh — ví dụ: giấy đăng ký kinh doanh hoặc hợp đồng thuê mặt bằng. Định dạng chấp nhận: DOC, DOCX hoặc PDF"
		superForm={form}
		{errors}
	/>

	<div class="my-2 text-right text-sm">
		<label class="flex items-center justify-end gap-2">
			<p>
				Tôi xác nhận rằng thông tin cung cấp là chính xác và tôi đồng ý với các chính sách, điều
				khoản dành cho người bán của nền tảng.
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
		Gửi thông tin đăng ký
		{#if $delayed}
			<span class="loading loading-spinner"></span>
		{/if}
	</button>
</form>
