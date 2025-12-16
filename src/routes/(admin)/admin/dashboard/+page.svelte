<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import DateRangeSelector from '$lib/components/ui/data-input/DateRangeSelector.svelte';
	import MonthDateRangeSelector from '$lib/components/ui/data-input/MonthDateRangeSelector.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { getAdminDashboardData } from '$lib/remotes/adminDashboardData.remote';
	import type { AdminDashboardData, DashboardViewType } from '$lib/types/Dashboard.js';
	import { orderStatusOptions, paymentStatusOptions } from '$lib/types/Order';
	import { getOrderStatusBadgeClass, getPaymentStatusBadgeClass } from '$lib/utils/classComposer';
	import {
		formatDate,
		formatDateTime,
		formatVND,
		getTitleFromOptionList,
		toDateISO
	} from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast.js';
	import AdminRevenueChart from './(components)/AdminRevenueChart.svelte';
	import TopProductCard from './(components)/AdminTopProductCard.svelte';
	import AdminTopShopCard from './(components)/AdminTopShopCard.svelte';

	let isLoading = $state(true);

	let view: DashboardViewType | null = $derived(
		page.url.searchParams.get('view') as DashboardViewType | null
	);
	let date: string | null = $derived(page.url.searchParams.get('date'));
	let from: string | null = $derived(page.url.searchParams.get('from'));
	let to: string | null = $derived(page.url.searchParams.get('to'));
	let dashboardData: AdminDashboardData | null = $state(null);

	const filledChartData = $derived.by(() => {
		if (!dashboardData) return [];
		const chart = dashboardData.revenueChart;
		const from = dashboardData.range.from;
		const to = dashboardData.range.to;

		const result = [];
		const start = new Date(from);
		const end = new Date(to);

		// Build a map for quick lookup
		const chartMap = Object.fromEntries(
			chart.map((item) => [
				toDateISO(new Date(item.date)),
				{
					revenue: item.revenue,
					platformFee: item.platformFee,
					orderCount: item.orderCount
				}
			])
		);

		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const currDate = new Date(d);
			const dateKey = toDateISO(currDate);

			result.push({
				date: currDate,
				revenue: chartMap[dateKey]?.revenue ?? 0,
				platformFee: chartMap[dateKey]?.platformFee ?? 0,
				orderCount: chartMap[dateKey]?.orderCount ?? 0
			});
		}
		return result;
	});

	$effect(() => {
		const loadData = async () => {
			try {
				const data = await getAdminDashboardData({
					view: view ?? 'custom',
					date: date ?? undefined,
					from: from ?? '2025-12-01',
					to: to ?? '2025-12-31'
				});
				dashboardData = data;
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			} finally {
				isLoading = false;
			}
		};

		loadData();
	});

	function handleThisMonthSelect() {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), 1);
		const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

		from = toDateISO(start);
		to = toDateISO(end);
		date = null;
		view = 'custom';

		handleApplySearchParams();
	}

	function handleReloadData() {
		invalidateAll();
		showToast({
			type: 'info',
			title: 'Đã tải lại dữ liệu'
		});
	}

	function handleApplySearchParams() {
		const searchParams = new URLSearchParams();
		if (view) searchParams.set('view', view);
		if (date) searchParams.set('date', date);
		if (from) searchParams.set('from', from);
		if (to) searchParams.set('to', to);

		goto(`${page.url.pathname}?${searchParams.toString()}`, {
			replaceState: true
		});
	}
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16, delay: 0.05 }} class="flex flex-col">
		<h1 class="text-header3 font-bold">Trang tổng quan quản trị</h1>
		<p class="text-base-content/60">
			Theo dõi các chỉ số quan trọng, doanh thu, cửa hàng và sản phẩm bán chạy nhất.
		</p>
	</AnimatedDiv>
</div>

{#if isLoading}
	<LoadingPlaceholder text="Đang tải dữ liệu..." />
{:else if dashboardData}
	<AnimatedDiv animateVars={{ translateY: -16, delay: 0.1 }} class="flex flex-wrap gap-2">
		<p class="flex items-center gap-2 text-sm text-primary-content">
			<span class="icon-[mingcute--calendar-2-line] text-xl"></span>Đang hiển thị dữ liệu từ
			<strong>{formatDate(dashboardData.range.from)}</strong>
			đến
			<strong>{formatDate(dashboardData.range.to)}</strong>
		</p>

		<button class="btn ml-2 btn-xs btn-primary" onclick={handleThisMonthSelect}>
			<span class="icon-[mingcute--target-line]"></span>Tháng này
		</button>

		<DateRangeSelector
			openButtonProps={{ class: 'btn btn-xs btn-secondary' }}
			popoverId="admin-dashboard-date-range"
			bind:startDate={from}
			bind:endDate={to}
			rangeEndCallback={() => handleApplySearchParams()}
		>
			<span class="icon-[mingcute--arrows-left-fill]"></span><span
				class="-ml-2 icon-[mingcute--arrows-right-fill]"
			></span>Lựa chọn khoảng ngày
		</DateRangeSelector>

		<MonthDateRangeSelector
			popoverId="month-selector"
			openButtonProps={{ class: 'btn btn-xs btn-info' }}
			bind:startDate={from}
			bind:endDate={to}
		>
			<span class="icon-[mingcute--calendar-2-line]"></span>Xem theo tháng
		</MonthDateRangeSelector>

		<button class="btn ml-auto btn-xs btn-info" onclick={handleReloadData}>
			<span class="icon-[mingcute--refresh-anticlockwise-1-fill]"></span> Cập nhật lại dữ liệu
		</button>
	</AnimatedDiv>

	<!-- User Summary -->
	<AnimatedDiv
		animateVars={{ translateY: 24, delay: 0.15 }}
		class="mt-3 stat rounded-box bg-base-100"
	>
		<div class="stat-title font-bold">Tóm tắt người dùng</div>
		<div class="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
			<div>
				<div class="text-xs text-base-content/70">Tổng số người dùng</div>
				<div class="font-serif text-lg font-bold">{dashboardData.userSummary.totalUsers}</div>
			</div>
			<div>
				<div class="text-xs text-base-content/70">Người dùng thông thường</div>
				<div class="font-serif text-lg font-bold">{dashboardData.userSummary.buyerCount}</div>
			</div>
			<div>
				<div class="text-xs text-secondary-content/70">Số người bán</div>
				<div class="font-serif text-lg font-bold text-secondary-content">
					{dashboardData.userSummary.sellerCount}
				</div>
			</div>
			<div>
				<div class="text-xs text-error-content/70">Số quản trị viên</div>
				<div class="font-serif text-lg font-bold text-error-content">
					{dashboardData.userSummary.adminCount}
				</div>
			</div>
			<div>
				<div class="text-xs text-info-content">Người dùng mới</div>
				<div class="font-serif text-lg font-bold text-info-content">
					{dashboardData.userSummary.newUsersInRange}
				</div>
			</div>
			<div>
				<div class="text-xs text-success-content">Đang hoạt động</div>
				<div class="font-serif text-lg font-bold text-success-content">
					{dashboardData.userSummary.activeUsersInRange}
				</div>
			</div>
		</div>
	</AnimatedDiv>

	<div class="mt-2 flex flex-col gap-2">
		<!-- Overview Stats -->
		<div class="grid grid-cols-12 gap-2 max-md:grid-cols-1">
			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.2 }}
				class="col-span-5 rounded-box bg-base-100 p-4 max-md:col-span-1"
			>
				<div class="stat-title font-bold">Sức khỏe hệ thống</div>
				<div class="flex items-center gap-2">
					<div>
						<div
							class="radial-progress m-4 font-serif text-xl font-bold {dashboardData.systemHealth
								.averageSystemRating >= 4
								? 'text-success-content'
								: dashboardData.systemHealth.averageSystemRating >= 2
									? 'text-warning-content'
									: 'text-error-content'}"
							style="--value:{(dashboardData.systemHealth.averageSystemRating / 5) * 100};"
							aria-valuenow={dashboardData.systemHealth.averageSystemRating}
							role="progressbar"
						>
							{dashboardData.systemHealth.averageSystemRating}
						</div>
					</div>
					<div class="flex flex-col">
						<div class="text-xs text-base-content">
							Tổng số sản phẩm: <strong class="ml-1 font-serif text-lg"
								>{dashboardData.systemHealth.totalProducts}</strong
							>
						</div>
						<div class="text-xs text-success-content">
							Số sản phẩm hoạt động: <strong class="ml-1 font-serif text-lg"
								>{dashboardData.systemHealth.activeProducts}</strong
							>
						</div>
						<div class="text-xs text-error-content">
							Số sản phẩm đang hết hàng: <strong class="ml-1 font-serif text-lg"
								>{dashboardData.systemHealth.outOfStockProducts}</strong
							>
						</div>
						<div class="text-xs text-warning-content">
							Cửa hàng đang chờ duyệt: <strong class="ml-1 font-serif text-lg"
								>{dashboardData.systemHealth.pendingShops}</strong
							>
						</div>
					</div>
				</div>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.25 }}
				class="col-span-3 stat rounded-box bg-base-100 max-md:col-span-1"
			>
				<div class="stat-title font-bold">Số cửa hàng</div>
				<div class="stat-value font-serif text-base-content">
					{dashboardData.overview.activeShops}
				</div>
				<div class="stat-desc text-info-content">
					Cửa hàng mới: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.overview.newShops}</strong
					>
				</div>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.3 }}
				class="col-span-4 stat rounded-box bg-base-100 max-md:col-span-1"
			>
				<div class="stat-title font-bold">Tổng số đơn hàng</div>
				<div class="stat-value font-serif">{dashboardData.overview.totalOrders}</div>
				<div class="stat-desc text-warning-content">
					Số đơn đang xử lý: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.overview.pendingOrders}</strong
					>
				</div>
				<div class="stat-desc text-success-content">
					Số đơn hoàn thành: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.overview.completedOrders}</strong
					>
				</div>
				<div class="stat-desc text-error-content">
					Số đơn đã huỷ: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.overview.cancelledOrders}</strong
					>
				</div>
			</AnimatedDiv>
		</div>

		<!-- Revenue chart row -->
		<div class="grid grid-cols-12 items-stretch gap-2 max-md:grid-cols-1">
			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.25 }}
				class="col-span-1 stat rounded-box bg-base-100 lg:col-span-9"
			>
				<div
					class="stat-title flex items-center justify-between gap-1 text-sm font-bold text-base-content"
				>
					<p class="flex items-center gap-1">
						<span class="icon-[mingcute--chart-line-fill] text-lg"></span>Biểu đồ doanh thu
					</p>
					<p class="flex items-center gap-2 text-xs font-light text-base-content/70">
						<span class="icon-[mingcute--calendar-2-line] text-base"></span>Đang hiển thị dữ liệu từ
						<strong>{formatDate(dashboardData.range.from)}</strong>
						đến
						<strong>{formatDate(dashboardData.range.to)}</strong>
					</p>
				</div>
				<div class="mt-2 h-[340px] p-4">
					<AdminRevenueChart chartData={filledChartData} />
				</div>
			</AnimatedDiv>
			<div class="col-span-3 flex flex-col gap-2">
				<AnimatedDiv
					animateVars={{ translateY: 24, delay: 0.35 }}
					class=" stat rounded-box bg-base-100 "
				>
					<div class="stat-title font-bold">Tổng doanh thu</div>
					<div class="stat-value font-serif text-success-content">
						{formatVND(dashboardData.overview.totalRevenue)}
					</div>
					<div class="stat-desc text-success-content">
						Lợi nhuận bán hàng: <strong class="ml-1 font-serif text-lg"
							>{formatVND(dashboardData.overview.netRevenue)}</strong
						>
					</div>
					<div class="stat-desc text-warning-content">
						Giá trị đơn trung bình: <strong class="ml-1 font-serif text-lg"
							>{formatVND(dashboardData.overview.averageOrderValue)}</strong
						>
					</div>
					<div class="stat-desc text-info-content">
						Phí trả cho nền tảng: <strong class="ml-1 font-serif text-lg"
							>{formatVND(dashboardData.overview.platformFee)}</strong
						>
					</div>
					<a class="btn mt-2 btn-sm btn-success" href={resolve('/(admin)/admin/platform-wallet')}
						><span class="icon-[mingcute--wallet-4-fill] text-lg"></span>Xem chi tiết ví nền tảng</a
					>
				</AnimatedDiv>
				<AnimatedDiv
					animateVars={{ translateY: 24, delay: 0.4 }}
					class="stat rounded-box bg-base-100 "
				>
					<div class="stat-title font-bold">Tổng quan hoàn tiền</div>
					<div class="stat-desc text-base-content">
						Tổng số yêu cầu: <strong class="ml-1 font-serif text-lg"
							>{dashboardData.refundSummary.totalRequests}</strong
						>
					</div>
					<div class="stat-desc text-warning-content">
						Đang chờ duyệt: <strong class="ml-1 font-serif text-lg"
							>{dashboardData.refundSummary.pendingAdminCount}</strong
						>
						{#if dashboardData.refundSummary.pendingAdminCount > 0}
							<a
								href={resolve('/(admin)/admin/refund-review')}
								class="ping ml-2 badge animate-pulse badge-xs badge-warning">Có yêu cầu mới</a
							>
						{/if}
					</div>
					<div class="stat-desc text-success-content">
						Đã chấp thuận: <strong class="ml-1 font-serif text-lg"
							>{dashboardData.refundSummary.approvedCount}</strong
						>
					</div>
					<div class="stat-desc text-error-content">
						Đã từ chối: <strong class="ml-1 font-serif text-lg"
							>{dashboardData.refundSummary.rejectedCount}</strong
						>
					</div>
					<div class="stat-desc font-bold text-error-content">
						Tổng tiền đã hoàn: <strong class="font-serif text-lg"
							>{formatVND(dashboardData.refundSummary.totalRefundAmount)}</strong
						>
					</div>
				</AnimatedDiv>
			</div>
		</div>

		<!-- Recent Orders -->
		<AnimatedDiv animateVars={{ translateY: 24, delay: 0.45 }} class="mt-4">
			<h2 class="mb-2 text-lg font-bold">Đơn hàng gần đây</h2>
			<div class="overflow-x-auto rounded-box border">
				<table class="table table-zebra bg-base-100 table-xs">
					<thead>
						<tr>
							<th>Mã đơn</th>
							<th>Khách hàng</th>
							<th>Cửa hàng</th>
							<th>Thời gian</th>
							<th>Trạng thái</th>
							<th>Thanh toán</th>
							<th>Tổng tiền</th>
						</tr>
					</thead>
					<tbody>
						{#each dashboardData.recentOrders as order}
							<tr>
								<td>{order.orderCode}</td>
								<td>{order.customerName}</td>
								<td>{order.shopName}</td>
								<td>{formatDateTime(order.createdAt)}</td>
								<td
									><div class="badge badge-xs {getOrderStatusBadgeClass(order.status)}">
										{getTitleFromOptionList(order.status, orderStatusOptions)}
									</div></td
								>
								<td
									><div class="badge badge-xs {getPaymentStatusBadgeClass(order.paymentStatus)}">
										{getTitleFromOptionList(order.paymentStatus, paymentStatusOptions)}
									</div></td
								>
								<td class="font-serif text-base font-bold text-success-content"
									>{formatVND(order.total)}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</AnimatedDiv>

		<!-- Top Shops -->
		<AnimatedDiv animateVars={{ translateY: 24, delay: 0.5 }} class="mt-4">
			<h2 class="mb-2 text-lg font-bold">Cửa hàng hàng đầu</h2>
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
				{#each dashboardData.topShops.slice(0, 3) as shop, index}
					<AdminTopShopCard {shop} {index} />
				{/each}
			</div>
		</AnimatedDiv>

		<!-- Top Products -->
		<AnimatedDiv animateVars={{ translateY: 24, delay: 0.55 }} class="mt-4">
			<h2 class="mb-2 text-lg font-bold">Sản phẩm bán chạy nhất</h2>
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-4">
				{#each dashboardData.topProducts.slice(0, 4) as product (product.productId)}
					<TopProductCard {product} />
				{/each}
			</div>
		</AnimatedDiv>
	</div>
{:else}
	<EmptyPlaceholder text="Không thể tải dữ liệu tổng quan quản trị." />
{/if}
