<script>
	import { invalidateAll } from '$app/navigation';
	import ImageWithFullscreenViewer from '$lib/components/ui/ImageWithFullscreenViewer.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import FormConfirmWithReasonPopoverButton from '$lib/components/wrapper/FormRejectWithReasonPopoverButton.svelte';
	import { getStatusBadgeClass } from '$lib/utils/classComposer';
	import { formatDate, formatDateTime } from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast.js';

	const { data, form } = $props();
	const { shop } = $derived(data);

	$inspect(form);

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);

			if (form.toastData.type === 'success') {
				invalidateAll();
			}
		}
	});
</script>

<div class="my-2 flex flex-wrap items-center justify-between">
	<div class="flex gap-3">
		<a href="/admin/shops-management/" aria-label="Quay lại danh sách cửa hàng" class="btn">
			<span class="icon-[fa7-solid--arrow-left]"></span>Trở về
		</a>
		<h2>Chi tiết cửa hàng: {shop.name}</h2>
	</div>

	<div class="flex items-center gap-2">
		{#if shop.status === 'Pending'}
			<p class="flex items-center gap-2 text-sm text-primary-content">
				<span class="icon-[mingcute--information-fill] text-lg"></span>
				Cửa hàng đang chờ phê duyệt, vui lòng kiểm tra thông tin và xử lý
			</p>
			<FormConfirmPopoverButton
				popoverId="approve-shop-popover"
				action="?/approve"
				openButtonProps={{
					type: 'button',
					class: 'btn btn-sm btn-success',
					'aria-label': 'Chấp thuận'
				}}
				formData={{
					id: String(shop.id)
				}}
				dropdownClass="dropdown-bottom dropdown-end"
				dropdownContent={{
					label: 'Chấp thuận cửa hàng?',
					description: 'Sau khi đã chấp thuận, cửa hàng sẽ được hiển thị công khai.',
					confirmBtnClass: 'btn-success',
					confirmBtnIcon: 'icon-[fa7-solid--check-circle]',
					confirmBtnText: 'Xác nhận'
				}}
				><span class="icon-[fa7-solid--check-circle] text-xl"></span>Chấp thuận
			</FormConfirmPopoverButton>
			<FormConfirmWithReasonPopoverButton
				popoverId="reject-shop-popover"
				action="?/reject"
				openButtonProps={{
					type: 'button',
					class: 'btn  btn-sm btn-error',
					'aria-label': 'Từ chối'
				}}
				formData={{
					id: String(shop.id)
				}}
				dropdownClass="dropdown-bottom dropdown-end"
				dropdownContent={{
					label: 'Từ chối cửa hàng?',
					description: 'Sau khi từ chối, người bán sẽ nhận được thông tin lý do từ chối.',
					confirmBtnClass: 'btn-error',
					confirmBtnIcon: 'icon-[fa7-solid--circle-xmark]',
					confirmBtnText: 'Xác nhận'
				}}
			>
				<span class="icon-[fa7-solid--circle-xmark] text-xl"></span>Từ chối
			</FormConfirmWithReasonPopoverButton>
		{/if}
	</div>
</div>
<!-- ============================================================================================= -->

<div class="rounded-box border bg-base-100 p-4">
	<div class="flex gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Ảnh đại diện cửa hàng</legend>
			<ImageWithFullscreenViewer
				src={shop.shopAvatar}
				class="h-32 w-32 rounded-full border"
				alt={shop.name + ' shop'}
			/>
		</fieldset>
		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend">Ảnh banner cửa hàng</legend>
			<ImageWithFullscreenViewer
				src={shop.shopBanner}
				alt={shop.name + ' shop'}
				class="h-32 w-full rounded-box border"
			/>
		</fieldset>
	</div>

	<div class="mt-2 flex flex-col gap-1 overflow-hidden">
		<div class="flex justify-between gap-4">
			<h3 class="text-header2">{shop.name}</h3>

			<div class="mt-1 flex flex-col flex-wrap items-end gap-2 text-xs text-base-content">
				<span>Mã cửa hàng: <strong>{shop.id}</strong></span>

				<span>Thời gian tạo: {formatDateTime(shop.createdAt)}</span>
				{#if shop.approvedAt}
					<span class="text-success-content"
						>Thời gian duyệt: {formatDateTime(shop.approvedAt)}</span
					>
				{/if}
			</div>
		</div>
		<p class="text-secondary-content-content font-bold italic">
			Danh mục cửa hàng: {shop.categoryName}
		</p>
		<div class="mt-1 flex items-center gap-2">
			<div class={`badge ${getStatusBadgeClass(shop.status)}`}>
				{shop.status === 'Pending'
					? 'Chờ duyệt'
					: shop.status === 'Approved'
						? 'Đã chấp thuận'
						: 'Đã từ chối'}
			</div>
			{#if shop.status === 'Approved' && shop.approvedAt}
				<p class="text-xs text-success-content italic">
					Hoạt động từ {formatDateTime(shop.approvedAt)}
				</p>
			{:else if shop.status === 'Rejected'}
				<p class="text-sm font-bold text-error-content italic">Lý do: {shop.rejectedReason}</p>
			{/if}
		</div>
		<p class="mt-2">{shop.description}</p>
	</div>

	<fieldset class="mt-2 fieldset">
		<legend class="fieldset-legend">Số điện thoại cửa hàng</legend>
		<label class="input w-full">
			<span class={`icon-[fa7-solid--phone-square] text-secondary-content`}></span>
			<input value={shop.phoneNumber} readonly />
		</label>
	</fieldset>

	<div class="grid grid-cols-2 gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Loại hình kinh doanh</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--briefcase] text-secondary-content`}></span>
				<input value={shop.businessType} readonly />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Danh mục chính</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--swatchbook] text-secondary-content`}></span>
				<input value={shop.categoryName} readonly />
			</label>
		</fieldset>
	</div>

	<div class="divider"></div>
	<h3>Địa chỉ cửa hàng</h3>

	<div class="grid grid-cols-3 gap-2 max-md:grid-cols-1">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Tỉnh / Thành phố</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--location-dot] text-secondary-content`}></span>
				<input value={shop.provinceName} readonly />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Quận / Huyện</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--location-dot] text-secondary-content`}></span>
				<input value={shop.districtName} readonly />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Phường / Xã</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--location-dot] text-secondary-content`}></span>
				<input value={shop.wardName} readonly />
			</label>
		</fieldset>
	</div>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Địa chỉ chi tiết</legend>
		<label class="input w-full">
			<span class={`icon-[fa7-solid--location-dot] text-secondary-content`}></span>
			<input value={shop.address} readonly />
		</label>
	</fieldset>

	<div class="divider"></div>
	<h3>Liên kết</h3>

	<div class="mt-2 grid grid-cols-3 gap-4 max-md:grid-cols-1">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Facebook</legend>
			<label class="input w-full">
				<span class={`text-secondary-content icon-[fa7-brands--facebook]`}></span>
				<input value={shop.shopFacebook ?? 'Chưa có'} readonly />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Instagram</legend>
			<label class="input w-full">
				<span class={`text-secondary-content icon-[fa7-brands--instagram]`}></span>
				<input value={shop.shopInstagram ?? 'Chưa có'} readonly />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">TikTok</legend>
			<label class="input w-full">
				<span class={`text-secondary-content icon-[fa7-brands--tiktok]`}></span>
				<input value={shop.shopTiktok ?? 'Chưa có'} readonly />
			</label>
		</fieldset>
	</div>
</div>

<!-- ============================================================================================= -->

<div class="mt-2 rounded-box border bg-base-100 p-4">
	<div class="flex flex-col gap-1">
		<h3>Thông tin chủ cửa hàng</h3>

		<div class="grid grid-cols-2 gap-4">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Họ và tên chủ cửa hàng</legend>
				<label class="input w-full">
					<span class={`icon-[fa7-solid--circle-user] text-secondary-content`}></span>
					<input value={shop.ownerFullName} readonly />
				</label>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Ngày sinh chủ cửa hàng</legend>
				<label class="input w-full">
					<span class={`icon-[fa7-solid--calendar-alt] text-secondary-content`}></span>
					<input value={formatDate(shop.ownerDateOfBirth)} readonly />
				</label>
			</fieldset>
		</div>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Số CMND/CCCD</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--id-card] text-secondary-content`}></span>
				<input value={shop.ownerPersonalIdNumber} readonly />
			</label>
		</fieldset>

		<div class="flex w-full gap-4">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Ảnh mặt trước CMND/CCCD</legend>
				<ImageWithFullscreenViewer
					src={shop.ownerPersonalIdFrontUrl}
					alt="Ảnh mặt trước CMND/CCCD"
					class="h-32 w-64  max-md:h-16 max-md:w-32"
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Ảnh mặt sau CMND/CCCD</legend>
				<ImageWithFullscreenViewer
					src={shop.ownerPersonalIdBackUrl}
					alt="Ảnh mặt sau CMND/CCCD"
					class="h-32 w-64 max-md:h-16 max-md:w-32"
				/>
			</fieldset>
		</div>
	</div>
</div>

<!-- ============================================================================================= -->

<div class="mt-2 overflow-auto rounded-box border bg-base-100 p-4">
	<h3>Tài liệu sở hữu kinh doanh</h3>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Tài liệu</legend>
		<a class="link" href={shop.ownershipDocumentUrl} target="_blank"
			>{shop.ownershipDocumentUrl?.split('/').pop() ?? 'Tài liệu'}</a
		>
	</fieldset>
</div>
