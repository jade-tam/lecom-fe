<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ImageWithFullscreenViewer from '$lib/components/ui/ImageWithFullscreenViewer.svelte';
	import { getStatusBadgeClass } from '$lib/utils/classComposer';
	import { formatDate, getTimeSince } from '$lib/utils/converters.js';
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

<div class="my-2 flex items-center justify-between">
	<div class="flex gap-3">
		<a
			href="/admin/shops-management/"
			aria-label="Quay lại danh sách cửa hàng"
			class="btn btn-square"
		>
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<h2>Chi tiết cửa hàng: {shop.name}</h2>
	</div>

	<div class="flex gap-2">
		<div class="flex items-center">
			{#if shop.status === 'Pending'}
				<form method="POST" action="?/approve" use:enhance>
					<input type="hidden" name="id" value={shop.id} />
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn m-1 btn-success">
							<span class="icon-[fa7-solid--check-circle]"></span> Chấp thuận
						</div>
						<div
							tabindex="-1"
							class="dropdown-content flex w-52 flex-col gap-2 rounded-field border bg-base-100 p-4"
						>
							<p class="font-bold">Chấp thuận cửa hàng này?</p>
							<button class="btn btn-success">
								<span class="icon-[fa7-solid--check-circle]"></span>Xác nhận duyệt</button
							>
						</div>
					</div>
				</form>
				<form method="POST" action="?/reject" use:enhance>
					<input type="hidden" name="id" value={shop.id} />
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn m-1 btn-error">
							<span class="icon-[fa7-solid--circle-xmark]"></span>Từ chối
						</div>
						<div
							tabindex="-1"
							class="dropdown-content flex w-96 flex-col gap-2 rounded-field border bg-base-100 p-4"
						>
							<p class="font-bold">Từ chối cửa hàng này?</p>
							<fieldset class="fieldset">
								<legend class="fieldset-legend">Lý do</legend>
								<label class="input w-full">
									<input name="reason" placeholder="Nhập lý do tại đây..." />
								</label>
							</fieldset>
							<button class="btn btn-error">
								<span class="icon-[fa7-solid--circle-xmark]"></span>Xác nhận từ chối</button
							>
						</div>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
<!-- ============================================================================================= -->

<div class="rounded-box border bg-base-100 p-4">
	<div class="flex gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Ảnh đại diện cửa hàng</legend>
			<ImageWithFullscreenViewer src={shop.shopAvatar} class="h-32 w-32 rounded-full border" alt={shop.name + ' shop'} />
		</fieldset>
		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend">Ảnh banner cửa hàng</legend>
			<ImageWithFullscreenViewer src={shop.shopBanner} alt={shop.name + ' shop'} class="h-32 w-full rounded-box border" />
		</fieldset>
	</div>

	<div class="mt-2 flex flex-col gap-1 overflow-hidden">
		<h3 class="text-header2">{shop.name}</h3>
		<p class="font-bold text-secondary-content-content italic">Danh mục cửa hàng: {shop.categoryName}</p>
		<div class="mt-1 flex items-center gap-2">
			<div class={`badge ${getStatusBadgeClass(shop.status)}`}>
				{shop.status === 'Pending'
					? 'Chờ duyệt'
					: shop.status === 'Approved'
						? 'Đã duyệt'
						: 'Đã từ chối'}
			</div>
			{#if shop.status === 'Approved'}
				<p class="text-xs italic">Hoạt động từ {formatDate(shop.approvedAt)}</p>
			{:else if shop.status === 'Rejected'}
				<p class="text-xs italic">Lý do: {shop.rejectedReason}</p>
			{/if}
		</div>
		<p class="mt-2">{shop.description}</p>
	</div>

	<!-- <div class="overflow-auto">
		<div class="stats mt-4 border">
			<div class="stat">
				<div class="stat-figure text-secondary-content">
					<span class="icon-[fa7-solid--box-archive] text-2xl"></span>
				</div>
				<div class="stat-title">Tổng số sản phẩm</div>
				<div class="stat-value">4</div>
				<div class="stat-desc">Trong {shop.categoryName}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary-content">
					<span class="icon-[fa7-solid--money-bill-trend-up] text-2xl"> </span>
				</div>
				<div class="stat-title">Tổng số đơn bán</div>
				<div class="stat-value">0</div>
				<div class="stat-desc">489 tháng trước ↗︎ 400 (22%)</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary-content">
					<span class="icon-[fa7-solid--business-time] text-2xl"></span>
				</div>
				<div class="stat-title">Thời gian hoạt động</div>
				{#if shop.status === 'Approved'}
					<div class="stat-value">{getTimeSince(shop.approvedAt)}</div>
					<div class="stat-desc">Từ {formatDate(shop.approvedAt)}</div>
				{:else}
					<div class="stat-value">---</div>
					<div class="stat-desc">Đang chờ duyệt...</div>
				{/if}
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary-content">
					<span class="icon-[fa7-solid--star] text-2xl"></span>
				</div>
				<div class="stat-title">Đánh giá cửa hàng</div>
				<div class="stat-value">4,3</div>
				<div class="stat-desc">145 lượt đánh giá</div>
			</div>
		</div>
	</div> -->

	<fieldset class="mt-2 fieldset">
		<legend class="fieldset-legend">Số điện thoại cửa hàng</legend>
		<label class="input w-full">
			<span class={`icon-[fa7-solid--phone-square] text-secondary-content`}></span>
			<input value={shop.phoneNumber} readonly />
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Địa chỉ cửa hàng</legend>
		<label class="input w-full">
			<span class={`icon-[fa7-solid--location-dot] text-secondary-content`}></span>
			<input value={shop.address} readonly />
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
				<ImageWithFullscreenViewer src={shop.ownerPersonalIdFrontUrl} alt="Ảnh mặt trước CMND/CCCD" class="h-32 w-64" />
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Ảnh mặt sau CMND/CCCD</legend>
				<ImageWithFullscreenViewer src={shop.ownerPersonalIdBackUrl} alt="Ảnh mặt sau CMND/CCCD" class="h-32 w-64" />
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
