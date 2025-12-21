<script lang="ts">
	import { goto } from '$app/navigation';
	import AddressSelectors from '$lib/components/ui/data-input/AddressSelectors.svelte';
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
{#if data.registerStatus?.status === 'Pending'}
	<div role="alert" class="alert alert-warning">
		<span class="icon-[mingcute--calendar-time-add-fill] text-xl"> </span>
		<span
			>Đơn đăng ký của bạn đang được xử lý. Chúng tôi sẽ thông báo cho bạn khi có cập nhật về trạng
			thái đơn đăng ký.</span
		>
		<span class="loading loading-infinity"> </span>
	</div>
{:else if data.registerStatus?.status === 'Approved'}
	<div role="alert" class="alert alert-success">
		<span class="icon-[mingcute--check-circle-fill] text-xl"> </span>
		<span
			>Đơn đăng ký của bạn đã được chấp thuận. Bạn có thể bắt đầu bán hàng trên cửa hàng của mình.</span
		>
	</div>
{:else if data.registerStatus?.status === 'Rejected'}
	<div role="alert" class="alert alert-error">
		<span class="icon-[mingcute--file-forbid-fill] text-xl"> </span>
		<div class="flex flex-col gap-1">
			<span
				>Đơn đăng ký của bạn đã bị quản trị viên từ chối. Vui lòng kiểm tra lại nguyên nhân và thử
				đăng ký lại.</span
			>
			<span class="font-bold">Lý do: {data.registerStatus?.rejectedReason}</span>
		</div>
	</div>
{/if}

{#if data.registerStatus?.status !== 'Pending' && data.registerStatus?.status !== 'Approved'}
	<!-- FORM ĐĂNG KÝ -->
	<form method="POST" class="mt-2 h-fit w-full rounded-box border bg-base-100 p-4 pt-2" use:enhance>
		<h3>Thông tin cá nhân</h3>
		<FormInput
			name="ownerFullName"
			label="Họ và tên"
			class="max-w-[400px]"
			icon="icon-[fa7-solid--circle-user] text-secondary-content text-sm"
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
			placeholder="Chọn ngày sinh của bạn..."
			icon="icon-[fa7-solid--calendar-alt] text-secondary-content text-sm"
			help="Phải trùng với ngày sinh trên giấy tờ tùy thân"
			type="text"
			withDateSelector
			superForm={form}
			{errors}
		/>

		<FormInput
			name="ownerPersonalIdNumber"
			label="Số CMND/CCCD"
			class="max-w-[400px]"
			placeholder="Nhập số CMND/CCCD..."
			icon="icon-[fa7-solid--id-card] text-secondary-content text-sm"
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
				icon="icon-[fa7-solid--image] text-secondary-content text-sm"
				superForm={form}
				{errors}
			/>

			<FormMediaInput
				class="aspect-video"
				aspectRatio="16:9"
				name="ownerPersonalIdBackUrl"
				icon="icon-[fa7-solid--image] text-secondary-content text-sm"
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
					icon="icon-[fa7-solid--shop] text-secondary-content text-sm"
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
					icon="icon-[fa7-solid--phone-square] text-secondary-content text-sm"
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
					label="Ảnh đại diện"
					class="h-39 w-38"
					icon="icon-[fa7-solid--image] text-secondary-content text-sm"
					superForm={form}
					{errors}
				/>
				<FormMediaInput
					name="shopBanner"
					label="Ảnh banner cửa hàng"
					class="h-39 w-full"
					icon="icon-[fa7-solid--image] text-secondary-content text-sm"
					superForm={form}
					aspectRatio="16:9"
					{errors}
				/>
			</div>
		</div>

		<FormInput
			name="shopDescription"
			label="Mô tả cửa hàng"
			icon="icon-[fa7-solid--align-justify] text-secondary-content text-sm"
			placeholder="Nhập mô tả cửa hàng..."
			type="text"
			superForm={form}
			{errors}
		/>

		<div class="divider"></div>
		<h3>Địa chỉ cửa hàng</h3>

		<AddressSelectors {form} {errors} />

		<FormInput
			name="shopAddress"
			label="Địa chỉ cụ thể"
			icon="icon-[fa7-solid--location-dot] text-secondary-content text-sm"
			placeholder="Địa chỉ cụ thể cửa hàng..."
			type="text"
			superForm={form}
			{errors}
		/>

		<FormSelect
			name="businessType"
			options={shopBusinessOptions}
			icon="icon-[fa7-solid--briefcase] text-secondary-content text-sm"
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
			icon="icon-[fa7-solid--list] text-secondary-content text-sm"
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
			icon="icon-[fa7-solid--file-text] text-secondary-content text-sm"
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
{/if}
