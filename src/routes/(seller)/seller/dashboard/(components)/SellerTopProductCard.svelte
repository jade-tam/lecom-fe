<script lang="ts">
	import type { SellerDashboardTopProduct } from '$lib/types/Dashboard';
	import { formatVND } from '$lib/utils/converters';

	const {
		product
	}: {
		product: SellerDashboardTopProduct;
	} = $props();
</script>

<div
	class="group relative overflow-hidden rounded-box border border-base-300 bg-base-100 transition-all duration-300 hover:border-primary hover:shadow-lg"
>
	<!-- Product Image with Overlay -->
	<div class="relative h-40 overflow-hidden bg-base-200">
		<img
			src={product.thumbnailUrl}
			alt={product.productName}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
		/>
		<div class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>

		<!-- Quantity Badge -->
		<div
			class="absolute right-2 bottom-2 rounded-lg bg-primary/90 px-2 py-1 text-xs font-bold text-primary-content backdrop-blur-sm"
		>
			{product.totalQuantity} đã bán
		</div>
	</div>

	<!-- Content Section -->
	<div class="p-4">
		<!-- Product Name & Shop -->
		<div class="mb-3">
			<h3 class="line-clamp-2 text-sm font-bold text-base-content">{product.productName}</h3>
		</div>

		<!-- Revenue & Quantity -->
		<div class="mb-3 space-y-2 rounded-lg bg-success/10 p-2.5">
			<div>
				<div class="text-xs font-semibold text-success-content/70">Tổng doanh thu</div>
				<div class="font-serif text-lg font-bold text-success-content">
					{formatVND(product.totalRevenue)}
				</div>
			</div>
			<div class="border-t border-secondary/20 pt-2">
				<div class="text-xs font-semibold text-secondary-content/70">Đã bán</div>
				<div class="font-serif text-sm font-bold text-secondary-content">
					{product.totalQuantity} sản phẩm
				</div>
			</div>
		</div>

		<!-- Rating & Feedback -->
		<div class="mb-3 flex items-center justify-between rounded-lg bg-base-200 p-2.5">
			<div class="flex items-center gap-1">
				<span class="text-sm text-warning-content"
					>Đánh giá trung bình <strong>{product.averageRating}</strong></span
				>
				<span class="icon-[mingcute--star-fill] text-xs text-warning-content"></span>
			</div>
			<div class="text-xs text-base-content/60">
				<span class="font-semibold text-base-content">{product.feedbackCount}</span> đánh giá
			</div>
		</div>
	</div>

	<!-- Footer Action -->
	<div class="border-t border-base-300 bg-base-200/30 px-3 py-2 text-center">
		<button class="btn btn-block btn-ghost btn-xs">
			<span class="icon-[mingcute--link-line] text-sm"></span>Xem sản phẩm
		</button>
	</div>
</div>
