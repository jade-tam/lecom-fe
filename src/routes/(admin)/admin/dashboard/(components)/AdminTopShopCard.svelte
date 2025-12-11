<script lang="ts">
	import type { AdminDashboardTopShop } from '$lib/types/Dashboard';
	import { formatVND } from '$lib/utils/converters';

	const {
		shop,
		index
	}: {
		shop: AdminDashboardTopShop;
		index: number;
	} = $props();
</script>

<div
	class="group relative overflow-hidden rounded-box border border-base-300 bg-base-100 transition-all duration-300 hover:border-primary hover:shadow-lg"
>
	<!-- Rank Badge -->
	<div
		class="absolute top-0 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-bl-lg text-xl {index ===
		0
			? 'bg-warning text-warning-content'
			: index === 1
				? 'bg-secondary text-secondary-content'
				: 'bg-accent text-accent-content'} font-serif text-lg font-bold"
	>
		#{index + 1}
	</div>

	<!-- Header Section with Logo -->
	<div class="relative h-32 overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
		<img
			src={shop.shopLogoUrl}
			alt={shop.shopName}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
		/>
		<div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
	</div>

	<!-- Content Section -->
	<div class="p-4">
		<!-- Shop Name & Seller -->
		<div class="mb-3">
			<h3 class="line-clamp-2 text-base font-bold text-base-content">{shop.shopName}</h3>
			<p class="text-xs text-base-content/60">
				Người bán: <span class="font-semibold">{shop.sellerName}</span>
			</p>
		</div>

		<!-- Revenue Highlight -->
		<div class="mb-4 rounded-lg bg-success/10 p-3">
			<div class="text-xs font-semibold text-success-content/70 uppercase">Tổng doanh thu</div>
			<div class="font-serif text-2xl font-bold text-success-content">
				{formatVND(shop.totalRevenue)}
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-3 gap-2 border-t border-base-300 pt-3">
			<div class="text-center">
				<div class="text-sm font-bold text-base-content">{shop.totalOrders}</div>
				<div class="text-xs text-base-content/60">Đơn hàng</div>
			</div>
			<div class="text-center">
				<div class="flex items-center justify-center gap-1 text-sm font-bold text-warning-content">
					{shop.averageRating}
					<span class="icon-[mingcute--star-fill] text-xs"></span>
				</div>
				<div class="text-xs text-base-content/60">Đánh giá</div>
			</div>
			<div class="text-center">
				<div class="text-sm font-bold text-info-content">{shop.productCount}</div>
				<div class="text-xs text-base-content/60">Sản phẩm</div>
			</div>
		</div>
	</div>

	<!-- Footer Action -->
	<div class="border-t border-base-300 bg-base-200/50 px-4 py-2 text-center">
		<button class="btn btn-block btn-ghost btn-sm">
			<span class="icon-[mingcute--link-line]"></span>Xem chi tiết cửa hàng
		</button>
	</div>
</div>
