<script lang="ts">
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { formatDate } from '$lib/utils/converters.js';

	const { data } = $props();
	const user = $derived(data.user);
</script>

<section class="min-h-screen bg-gradient-to-br from-base-200/50 to-base-100">
	<div class="mx-auto w-full max-w-6xl p-4 md:p-6">
		<!-- Header -->
		<div class="mb-6 flex items-center gap-2">
			<a
				href="/admin/users-management"
				aria-label="Quay lại danh sách người dùng"
				class="btn btn-square btn-ghost"
			>
				<span class="icon-[fa7-solid--arrow-left] text-xl"></span>
			</a>
			<div class="flex-1">
				<h1 class="text-3xl font-bold">Chi tiết người dùng</h1>
				<p class="mt-1 text-base-content/60">Xem thông tin chi tiết về tài khoản người dùng</p>
			</div>
		</div>

		<!-- Main Content -->
		<div class="space-y-2">
			<!-- Profile Card -->
			<div class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-base-300">
				<div class="flex flex-col items-start gap-6 md:flex-row md:items-center">
					<!-- Avatar & Status -->
					<div class="flex flex-col items-center gap-3">
						<Image
							class="h-32 w-32 rounded-full border-4 border-base-200 object-cover"
							src={user.imageUrl ?? '/images/avatar-placeholder.png'}
							alt={user.fullName}
						/>
						<div
							class="badge badge-xs {user.isActive
								? 'badge-success'
								: 'badge-error'} gap-2 px-3 py-2"
						>
							{user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
						</div>
					</div>

					<!-- Basic Info -->
					<div class="flex-1">
						<div class="space-y-3">
							<div>
								<p class="text-2xl font-bold">{user.fullName}</p>
								<p class="text-base-content/60">@{user.userName}</p>
							</div>

							<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div class="flex items-start gap-3">
									<span class="mt-1 icon-[fa7-solid--envelope] text-primary-content"></span>
									<div>
										<p class="text-xs font-semibold text-base-content/60">Email</p>
										<p class="text-sm font-medium break-all">{user.email}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="mt-1 icon-[fa7-solid--phone] text-primary-content"></span>
									<div>
										<p class="text-xs font-semibold text-base-content/60">Số điện thoại</p>
										<p class="text-sm font-medium">{user.phoneNumber ?? '—'}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="mt-1 icon-[fa7-solid--calendar] text-primary-content"></span>
									<div>
										<p class="text-xs font-semibold text-base-content/60">Ngày sinh</p>
										<p class="text-sm font-medium">{formatDate(user.dateOfBirth)}</p>
									</div>
								</div>

								<div class="flex items-start gap-3">
									<span class="mt-1 icon-[fa7-solid--map-location-dot] text-primary-content"></span>
									<div>
										<p class="text-xs font-semibold text-base-content/60">Địa chỉ</p>
										<p class="text-sm font-medium">{user.address ?? '—'}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Account Security & Activity Grid -->
			<div class="grid gap-2 md:grid-cols-2">
				<!-- Account Information -->
				<div class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-base-300">
					<h2 class="mb-4 flex items-center gap-2 text-lg font-bold">
						<span class="icon-[fa7-solid--lock]"></span>
						Thông tin tài khoản
					</h2>
					<div class="space-y-3">
						<div class="flex items-center justify-between border-b pb-2">
							<p class="text-sm text-base-content/70">Đã xác nhận email</p>
							<span class="badge {user.emailConfirmed ? 'badge-success' : 'badge-error'}">
								{user.emailConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
							</span>
						</div>

						<div class="flex items-center justify-between border-b pb-2">
							<p class="text-sm text-base-content/70">Đã xác nhận số điện thoại</p>
							<span class="badge {user.phoneNumberConfirmed ? 'badge-success' : 'badge-error'}">
								{user.phoneNumberConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
							</span>
						</div>

						<div class="flex items-center justify-between border-b pb-2">
							<p class="text-sm text-base-content/70">Xác thực 2 yếu tố</p>
							<span class="badge {user.twoFactorEnabled ? 'badge-success' : 'badge-error'}">
								{user.twoFactorEnabled ? 'Đang bật' : 'Chưa mở'}
							</span>
						</div>

						<div class="flex items-center justify-between border-b pb-2">
							<p class="text-sm text-base-content/70">Trạng thái lockout</p>
							<span class="badge {user.lockoutEnabled ? 'badge-success' : 'badge-error'}">
								{user.lockoutEnabled ? 'Đang bật' : 'Đang tắt'}
							</span>
						</div>

						<div class="flex items-center justify-between">
							<p class="text-sm text-base-content/70">Lần đăng nhập thất bại</p>
							<span
								class="font-semibold {user.accessFailedCount > 0 ? 'text-warning' : 'text-success'}"
							>
								{user.accessFailedCount}
							</span>
						</div>
					</div>
				</div>

				<!-- Activity Summary -->
				<div class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-base-300">
					<h2 class="mb-4 flex items-center gap-2 text-lg font-bold">
						<span class="icon-[fa7-solid--chart-simple]"></span>
						Hoạt động
					</h2>
					<div class="grid grid-cols-3 gap-3">
						<div class="rounded-field border-l-4 border-primary bg-primary/5 p-3">
							<p class="text-xs font-semibold text-base-content/60">Bài viết</p>
							<p class="font-serif text-2xl font-bold">{user.posts?.length ?? 0}</p>
						</div>

						<div class="rounded-field border-l-4 border-secondary bg-secondary/5 p-3">
							<p class="text-xs font-semibold text-base-content/60">Bình luận</p>
							<p class="font-serif text-2xl font-bold">{user.comments?.length ?? 0}</p>
						</div>

						<div class="rounded-field border-l-4 border-success bg-success/5 p-3">
							<p class="text-xs font-semibold text-base-content/60">Đánh giá</p>
							<p class="font-serif text-2xl font-bold">{user.reviews?.length ?? 0}</p>
						</div>

						<div class="rounded-field border-l-4 border-info bg-info/5 p-3">
							<p class="text-xs font-semibold text-base-content/60">Khóa học</p>
							<p class="font-serif text-2xl font-bold">{user.enrollments?.length ?? 0}</p>
						</div>

						<div class="rounded-field border-l-4 border-warning bg-warning/5 p-3">
							<p class="text-xs font-semibold text-base-content/60">Huy hiệu</p>
							<p class="font-serif text-2xl font-bold">{user.userBadges?.length ?? 0}</p>
						</div>

						<div class="rounded-field border-l-4 border-accent bg-accent/5 p-3">
							<p class="text-xs font-semibold text-base-content/60">Phiếu giảm</p>
							<p class="font-serif text-2xl font-bold">{user.userVouchers?.length ?? 0}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Certificate & Shop -->
			<div class="grid gap-2 md:grid-cols-2">
				<!-- Certificate -->
				<div class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-base-300">
					<h2 class="mb-4 flex items-center gap-2 text-lg font-bold">
						<span class="icon-[fa7-solid--certificate]"></span>
						Chứng chỉ
					</h2>

					{#if user.certificateImageUrl}
						<div class="space-y-3">
							<Image
								src={user.certificateImageUrl}
								alt="Chứng chỉ"
								class="w-full rounded-md border border-base-200"
							/>
							<a
								href={user.certificateImageUrl}
								target="_blank"
								rel="noreferrer"
								class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
							>
								<span class="icon-[fa7-solid--arrow-up-right-from-square]"></span>
								Xem đầy đủ
							</a>
						</div>
					{:else}
						<EmptyPlaceholder text="Không có chứng chỉ" />
					{/if}
				</div>

				<!-- Shop -->
				<div class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-base-300">
					<h2 class="mb-4 flex items-center gap-2 text-lg font-bold">
						<span class="icon-[fa7-solid--shop]"></span>
						Cửa hàng
					</h2>

					{#if user.shop}
						<div class="space-y-3">
							<div>
								<p class="font-semibold">{user.shop.name}</p>
								<p class="mt-1 text-sm text-base-content/70">{user.shop.description}</p>
							</div>
							<a
								href={`/shops/${user.shop.id}`}
								class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
							>
								<span class="icon-[fa7-solid--arrow-right]"></span>
								Xem cửa hàng
							</a>
						</div>
					{:else}
						<EmptyPlaceholder text="Chưa có cửa hàng" />
					{/if}
				</div>
			</div>

			<!-- System Info -->
			<div class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-base-300">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-bold">
					<span class="icon-[fa7-solid--microchip]"></span>
					Thông tin hệ thống
				</h2>
				<div class="space-y-2 font-mono text-sm">
					<div class="flex justify-between border-b pb-2">
						<span class="text-base-content/70">ID người dùng:</span>
						<code class="text-xs select-all">{user.id}</code>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	code {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace;
	}
</style>
