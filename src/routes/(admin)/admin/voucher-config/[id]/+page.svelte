<script lang="ts">
	import { goto } from '$app/navigation';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { formatDate } from '$lib/utils/converters';

	const { data } = $props();

	function handleBack() {
		goto('/admin/voucher-config');
	}
</script>

{#await data.voucherPromise}
	<LoadingPlaceholder text="Đang tải thông tin phiếu giảm giá..." />
{:then voucher}
	{#if voucher}
		<div class="my-2 flex flex-col gap-2">
			<!-- Return Button and Title -->
			<AnimatedDiv class=" flex items-center gap-4" animateVars={{ translateX: -20 }}>
				<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
					<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
				</button>
				<h1 class="text-header3 font-bold">Phiếu giảm giá - {voucher.code}</h1>
				<span class={`ml-2 badge ${voucher.isActive ? 'badge-success' : 'badge-error'}`}>
					{voucher.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
				</span>
			</AnimatedDiv>

			<AnimatedDiv class=" flex items-center gap-4" animateVars={{ translateX: -20 }}>
				<p class="text-xs text-base-content/70">Ngày bắt đầu: {formatDate(voucher.startDate)}</p>
				<p class="text-xs text-base-content/70">Ngày kết thúc: {formatDate(voucher.endDate)}</p>
			</AnimatedDiv>

			<AnimatedDiv class="mb-2 rounded-box border bg-base-100 p-4" animateVars={{ translateY: 24 }}>
				<h3 class="mb-4">Thông tin chi tiết</h3>
				<div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
					<div class="flex flex-col gap-2">
						<div>
							<strong>Loại giảm giá:</strong>
							{voucher.discountType === 'Percentage' ? 'Phần trăm' : 'Số tiền cố định'}
						</div>
						<div>
							<strong>Giá trị giảm:</strong>
							{voucher.discountType === 'Percentage'
								? `${voucher.discountValue}%`
								: `${voucher.discountValue.toLocaleString()}₫`}
						</div>
						<div><strong>Giảm tối đa:</strong> {voucher.maxDiscountAmount.toLocaleString()}₫</div>
						<div><strong>Đơn tối thiểu:</strong> {voucher.minOrderAmount.toLocaleString()}₫</div>
						<div><strong>Số lượng còn lại:</strong> {voucher.quantityAvailable}</div>
						<div><strong>Giới hạn sử dụng mỗi người:</strong> {voucher.usageLimitPerUser}</div>
					</div>
					<div class="flex flex-col gap-2">
						<div>
							<strong>Mã voucher:</strong> <span class="font-mono">{voucher.code}</span>
						</div>
						<div>
							<strong>ID voucher:</strong> <span class="font-mono">{voucher.id}</span>
						</div>
					</div>
				</div>
			</AnimatedDiv>

			<!-- Thông tin người dùng đã nhận voucher (nếu có) -->
			{#if voucher.userVouchers && voucher.userVouchers.length}
				<section class="mb-2 rounded-box border bg-base-100 p-4">
					<h2 class="text-header4 mb-2 font-bold">Người dùng đã nhận voucher</h2>
					<ul class="list-disc pl-4">
						{#each voucher.userVouchers as userVoucher}
							<li>
								{#if userVoucher.userName}
									{userVoucher.userName} ({userVoucher.email})
								{:else}
									{JSON.stringify(userVoucher)}
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	{:else}
		<EmptyPlaceholder text="Không tìm thấy thông tin phiếu giảm giá." />
	{/if}
{:catch error}
	<p class="text-error">Không thể tải thông tin phiếu giảm giá: {error.message}</p>
{/await}
