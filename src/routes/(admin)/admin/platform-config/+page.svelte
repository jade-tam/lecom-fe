<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';

	const { data } = $props();
	const config = $derived(data.platformConfig);
</script>

<div class="my-2 flex flex-col gap-2">
	<!-- Header -->
	<div>
		<AnimatedDiv class="flex items-center gap-4" animateVars={{ translateX: -20 }}>
			<h1 class="text-header3 font-bold">Cấu hình toàn hệ thống</h1>
		</AnimatedDiv>

		<AnimatedDiv animateVars={{ translateX: -20 }}>
			<p class="text-base-content/60">
				Quản lý các cấu hình toàn hệ thống như hoa hồng, rút tiền, hoàn tiền và tích hợp thanh toán.
			</p>
		</AnimatedDiv>
	</div>

	<!-- ===== Commission & Orders ===== -->
	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<div class="rounded-box bg-base-100 p-4">
			<h3 class="mb-3 font-semibold">Tiền hoa hồng & Đơn hàng</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<p class="text-sm text-base-content/60">Tỉ lệ hoa hồng hệ thống thu</p>
					<p class="font-serif text-2xl font-bold text-success-content">
						{config.defaultCommissionRate}%
					</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Số ngày giữ đơn hàng</p>
					<p class="font-serif text-2xl font-bold text-primary-content">
						{config.orderHoldingDays} ngày
					</p>
				</div>
			</div>
		</div>
	</AnimatedDiv>

	<!-- ===== Withdrawal & Refund ===== -->
	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<div class="rounded-box bg-base-100 p-4">
			<h3 class="mb-3 font-semibold">Rút tiền & Hoàn tiền</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<p class="text-sm text-base-content/60">Số tiền rút tối thiểu</p>
					<p class="font-serif font-bold text-success-content">
						{config.minWithdrawalAmount.toLocaleString()} đ
					</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Số tiền rút tối đa</p>
					<p class="font-serif font-bold text-success-content">
						{config.maxWithdrawalAmount.toLocaleString()} đ
					</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Tự động duyệt rút tiền</p>
					<span class="badge {config.autoApproveWithdrawal ? 'badge-success' : 'badge-ghost'}">
						{config.autoApproveWithdrawal ? 'Đang bật' : 'Đang tắt'}
					</span>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Thời hạn hoàn tiền</p>
					<p class="font-serif font-bold">
						{config.maxRefundDays} ngày
					</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Tự động duyệt hoàn tiền</p>
					<span class="badge {config.autoApproveRefund ? 'badge-success' : 'badge-ghost'}">
						{config.autoApproveRefund ? 'Đang bật' : 'Đang tắt'}
					</span>
				</div>
			</div>
		</div>
	</AnimatedDiv>

	<!-- ===== PayOS ===== -->
	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<div class="rounded-box bg-base-100 p-4">
			<h3 class="mb-3 font-semibold">Thông tin thanh toán (PayOS)</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<p class="text-sm text-base-content/60">Môi trường</p>
					<p class="font-mono text-sm">{config.payOSEnvironment}</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Client ID</p>
					<p class="truncate font-mono text-sm">{config.payOSClientId}</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">API Key</p>
					<p class="truncate font-mono text-sm">{config.payOSApiKey}</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Checksum Key</p>
					<p class="truncate font-mono text-sm">{config.payOSChecksumKey}</p>
				</div>
			</div>
		</div>
	</AnimatedDiv>

	<!-- ===== Notifications ===== -->
	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<div class="rounded-box bg-base-100 p-4">
			<h3 class="mb-3 font-semibold">Các kênh thông báo</h3>

			<div class="flex gap-2">
				<span class="badge {config.enableEmailNotification ? 'badge-success' : 'badge-ghost'}">
					Qua Email {config.enableEmailNotification ? '(Đang bật)' : ' (Đang tắt)'}
				</span>

				<span class="badge {config.enableSMSNotification ? 'badge-success' : 'badge-ghost'}">
					Qua tin nhắn SMS {config.enableSMSNotification ? '(Đang bật)' : ' (Đang tắt)'}
				</span>
			</div>
		</div>
	</AnimatedDiv>

	<!-- ===== Metadata ===== -->
	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<div class="rounded-box bg-base-100 p-4">
			<h3 class="mb-3 font-semibold">Thông tin thay đổi</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<p class="text-sm text-base-content/60">Cập nhật lần cuối</p>
					<p class="font-mono text-sm">{config.lastUpdated}</p>
				</div>

				<div>
					<p class="text-sm text-base-content/60">Bởi quản trị viên ID</p>
					<p class="font-mono text-sm">{config.lastUpdatedBy}</p>
				</div>
			</div>
		</div>
	</AnimatedDiv>
</div>
