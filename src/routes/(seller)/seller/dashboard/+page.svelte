<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import DateRangeSelector from '$lib/components/ui/data-input/DateRangeSelector.svelte';
	import MonthDateRangeSelector from '$lib/components/ui/data-input/MonthDateRangeSelector.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { getGHNStatus, getShopAddress } from '$lib/remotes/shopAddress.remote';
	import type { DashboardViewType, SellerDashboardData } from '$lib/types/Dashboard.js';
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
	import 'cally';
	import RevenueChart from './(components)/RevenueChart.svelte';
	import SellerTopProductCard from './(components)/SellerTopProductCard.svelte';

	const { data } = $props();
	let dashboardData: SellerDashboardData | null = $state(null);
	let isLoading = $state(true);

	let view: DashboardViewType | null = $derived(
		page.url.searchParams.get('view') as DashboardViewType | null
	);
	let date: string | null = $derived(page.url.searchParams.get('date'));
	let from: string | null = $derived(page.url.searchParams.get('from'));
	let to: string | null = $derived(page.url.searchParams.get('to'));

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
			chart.map((item) => [toDateISO(new Date(item.date)), item.revenue])
		);

		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const currDate = new Date(d);

			result.push({
				date: currDate,
				revenue: chartMap[toDateISO(currDate)] ?? 0
			});
		}
		return result;
	});

	const ratingKeys = [
		'rating1Count',
		'rating2Count',
		'rating3Count',
		'rating4Count',
		'rating5Count'
	] as const;

	$effect(() => {
		const setDashboardData = async () => {
			dashboardData = await data.dashboardDataPromise;
			isLoading = false;
		};

		setDashboardData();
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
	<AnimatedDiv animateVars={{ translateX: -16, delay: 0.1 }} class="flex flex-col">
		<h1 class="text-header3 font-bold">Trang tổng quan</h1>
		<p class="text-base-content/60">
			Theo dõi doanh thu, sản phẩm bán chạy và đơn hàng mới nhất của cửa hàng.
		</p>
	</AnimatedDiv>

	{#if dashboardData}
		<AnimatedDiv
			animateVars={{ translateX: 16, delay: 0.1 }}
			class="flex flex-col rounded-field border bg-base-100 px-3 py-1"
		>
			<p class="text-xs text-base-content/70">Cửa hàng</p>
			<p class="font-serif font-bold text-primary-content">{dashboardData.shopName}</p>
		</AnimatedDiv>
	{/if}
</div>

{#await getGHNStatus() then status}
	{#if status}
		{#if !status.isConnected}
			<AnimatedDiv
				animateVars={{ translateX: 20, duration: 0.6 }}
				class="mb-3 alert animate-pulse alert-warning"
			>
				<span class="icon-[mingcute--truck-line] text-xl"> </span>
				<div class="flex flex-col gap-1">
					<span class="font-bold">Chưa kết nối với đơn vị vận chuyển Giao Hàng Nhanh</span>

					<span>{status?.message}</span>
				</div>
				<a href={resolve('/(seller)/seller/configuration')} class="btn ml-auto btn-neutral">
					Thiết lập ngay <span class="icon-[mingcute--arrow-right-circle-line] text-xl"></span>
				</a>
			</AnimatedDiv>
		{/if}
	{/if}
{/await}

{#await getShopAddress() then shopAddress}
	{#if !shopAddress}
		<AnimatedDiv
			animateVars={{ translateX: 20, delay: 0.1, duration: 0.6 }}
			class="mb-3 alert animate-pulse alert-warning"
		>
			<span class="icon-[mingcute--location-2-line] text-xl"> </span>
			<div class="flex flex-col gap-1">
				<span class="font-bold">Chưa thiết lập địa chỉ kho hàng</span>

				<span
					>Vui lòng thiết lập địa chỉ kho hàng để hoàn tất quá trình đăng ký cửa hàng và bắt đầu bán
					hàng.</span
				>
			</div>
			<a href={resolve('/(seller)/seller/configuration')} class="btn ml-auto btn-neutral">
				Thiết lập ngay <span class="icon-[mingcute--arrow-right-circle-line] text-xl"></span>
			</a>
		</AnimatedDiv>
	{/if}
{/await}

{#if dashboardData}
	<AnimatedDiv animateVars={{ translateY: -16, delay: 0.15 }} class="flex flex-wrap gap-2">
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
			popoverId="seller-dashboard-date-range"
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
			onMonthSelected={() => handleApplySearchParams()}
		>
			<span class="icon-[mingcute--calendar-2-line]"></span>Xem theo tháng
		</MonthDateRangeSelector>

		<button class="btn ml-auto btn-xs btn-info" onclick={handleReloadData}>
			<span class="icon-[mingcute--refresh-anticlockwise-1-fill]"></span> Cập nhật lại dữ liệu
		</button>
	</AnimatedDiv>

	<div class="mt-3 flex flex-col gap-2">
		<!-- Overview Stats -->
		<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.2 }}
				class="stat rounded-box bg-base-100"
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
				<div class="stat-desc text-info-content">
					Số khách hàng duy nhất: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.overview.uniqueCustomers}</strong
					>
				</div>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.25 }}
				class="stat rounded-box bg-base-100"
			>
				<div class="stat-title font-bold">Tổng doanh thu</div>
				<div class="stat-value font-serif text-success-content">
					{formatVND(dashboardData.overview.totalRevenue)}
				</div>
				<div class="stat-desc text-success-content">
					Thu nhập thực nhận: <strong class="ml-1 font-serif text-lg"
						>{formatVND(dashboardData.overview.netRevenue)}</strong
					>
				</div>
				<div class="stat-desc text-info-content">
					Giá trị đơn trung bình: <strong class="ml-1 font-serif text-lg"
						>{formatVND(dashboardData.overview.averageOrderValue)}</strong
					>
				</div>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.3 }}
				class="stat rounded-box bg-base-100"
			>
				<div class="stat-title font-bold">Đánh giá</div>
				<div class="stat-value flex items-center gap-2 font-serif text-warning-content">
					{dashboardData.ratingSummary.averageRating}<span class="icon-[mingcute--star-fill]"
					></span>
				</div>
				<div class="stat-desc line-clamp-1">
					Tổng số lượt đánh giá: <strong>{dashboardData.ratingSummary.totalFeedbacks}</strong>
				</div>
				<div class="stat-desc line-clamp-1">
					Tích cực: <strong>{dashboardData.ratingSummary.positiveRate}%</strong>
				</div>
				<div class="flex flex-wrap gap-x-4 text-xs">
					{#each [1, 2, 3, 4, 5] as star}
						<span class="flex items-center text-warning-content">
							<span>{star}</span>
							<span class="icon-[mingcute--star-fill]"></span>:
							<span class="ml-1 font-serif text-base font-bold text-base-content/70"
								>{dashboardData.ratingSummary[
									`rating${star}Count` as keyof typeof dashboardData.ratingSummary
								]}</span
							>
						</span>
					{/each}
				</div>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: 24, delay: 0.35 }}
				class="stat rounded-box bg-base-100"
			>
				<div class="stat-title font-bold">Tổng quan hoàn tiền</div>
				<!-- <div class="stat-value font-serif text-error-content">{dashboardData.refundSummary.totalRequests}</div> -->
				<div class="stat-desc text-base-content">
					Tổng số yêu cầu: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.refundSummary.totalRequests}</strong
					>
				</div>
				<div class="stat-desc text-warning-content">
					Đang chờ duyệt: <strong class="ml-1 font-serif text-lg"
						>{dashboardData.refundSummary.pendingCount}</strong
					>
					{#if dashboardData.refundSummary.pendingCount > 0}
						<a
							href={resolve('/(seller)/seller/refunds')}
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

		<AnimatedDiv
			animateVars={{ translateY: 24, delay: 0.4 }}
			class="grid grid-cols-1 gap-2 lg:grid-cols-12"
		>
			<div class="col-span-1 stat rounded-box bg-base-100 lg:col-span-8">
				<div class="stat-title flex items-center gap-1 text-sm font-bold text-base-content">
					<span class="icon-[mingcute--chart-line-fill] text-lg"></span>Biểu đồ doanh thu
				</div>
				<div class="mt-2 h-[200px] p-4">
					<RevenueChart chartData={filledChartData} />
				</div>
			</div>

			<div class="col-span-1 stat rounded-box bg-base-100 lg:col-span-4">
				<div
					class="stat-title flex items-center justify-between gap-1 text-sm font-bold text-base-content"
				>
					<p class="flex items-center gap-1">
						<span class="icon-[mingcute--wallet-3-fill] text-lg"></span>Số dư ví cửa hàng
					</p>
					<a href={resolve('/seller/wallet')} class="btn btn-xs btn-secondary"
						><span class="icon-[mingcute--paper-2-line]"></span>Lịch sử giao dịch</a
					>
				</div>
				<div class="stat-value font-serif font-bold text-success-content">
					<strong class="font-serif font-bold"
						>{formatVND(dashboardData.walletSummary.availableBalance)}</strong
					>
				</div>
				<div class="text-sm text-warning-content">
					Tổng:
					<strong class="font-serif font-bold"
						>{formatVND(dashboardData.walletSummary.totalEarned)}</strong
					>
					(Đang tạm giữ:
					<strong class="font-serif font-bold"
						>{formatVND(dashboardData.walletSummary.pendingBalance)}</strong
					>)
				</div>

				<div class="divider my-1"></div>

				<div class="text-sm text-warning-content">
					Số tiền rút đang chờ duyệt: <strong class="font-serif font-bold"
						>{formatVND(dashboardData.walletSummary.pendingWithdrawalAmount)}</strong
					>
				</div>
				<div class="text-sm text-success-content">
					Số dư đã rút: <strong class="font-serif font-bold"
						>{formatVND(dashboardData.walletSummary.approvedWithdrawalAmount)}</strong
					>
				</div>

				<div class="divider my-1"></div>

				<div class="stat-desc text-xs italic">
					Cập nhật lần cuối lúc: <strong
						>{formatDateTime(dashboardData.walletSummary.lastUpdatedAt)}</strong
					>
				</div>
			</div>
		</AnimatedDiv>

		<!-- Recent Orders -->
		<AnimatedDiv animateVars={{ translateY: 24, delay: 0.5 }} class="mt-4">
			<div class="flex items-center gap-2">
				<h2 class="mb-2 text-lg font-bold">Đơn hàng gần đây</h2>
				<a href={resolve('/seller/orders')} class="btn btn-xs"
					><span class="icon-[mingcute--arrows-right-fill]"></span>Xem tất cả đơn hàng</a
				>
			</div>
			<div class="overflow-x-auto rounded-box border">
				<table class="table table-zebra bg-base-100 table-xs">
					<thead>
						<tr>
							<th>Mã đơn</th>
							<th>Khách hàng</th>
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

		<!-- Top Products -->
		<AnimatedDiv animateVars={{ translateY: 24, delay: 0.5 }} class="mt-4">
			<h2 class="mb-2 text-lg font-bold">Các sản phẩm bán chạy</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{#each dashboardData.topProducts as product}
					<!-- <div class="stat flex flex-col items-center rounded-box bg-base-100 p-4">
						<img
							src={product.thumbnailUrl}
							alt={product.productName}
							class="mb-2 h-16 w-16 rounded object-cover"
						/>
						<div class="stat-title line-clamp-1 font-bold">{product.productName}</div>
						<div class="stat-value font-serif text-xl font-bold">
							{product.totalQuantity} đã bán
						</div>
						<div class="stat-desc">
							Tổng doanh thu: <strong class="font-serif text-base text-success-content"
								>{formatVND(product.totalRevenue)}</strong
							>
						</div>
						<div class="stat-desc flex items-center gap-1">
							Đánh giá: <span class="flex items-center gap-1 text-warning-content"
								>{product.averageRating}<span class="icon-[mingcute--star-fill]"></span></span
							>
							({product.feedbackCount})
						</div>
					</div> -->
					<SellerTopProductCard {product} />
				{/each}
			</div>
		</AnimatedDiv>
	</div>
{:else}
	<LoadingPlaceholder text="Đang tải dữ liệu..." />
{/if}
