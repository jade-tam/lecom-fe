<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import { orderStatusOptions, type Order } from '$lib/types/Order';
	import { getOrderStatusBadgeClass, getOrderStatusBtnClass } from '$lib/utils/classComposer';
	import {
		formatDate,
		formatDateTime,
		formatVND,
		getTitleFromOptionList
	} from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { ordersPromise }: { ordersPromise: Promise<Order[]> } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as Order[],
			columns: [
				{ id: 'orderCode', key: 'orderCode', name: 'Đơn hàng', sortable: false },
				{ id: 'customerName', key: 'customerName', name: 'Khách hàng', sortable: false },
				{ id: 'status', key: 'status', name: 'Trạng thái đơn' },
				{ id: 'total', key: 'total', name: 'Tổng tiền' },
				{ id: 'createdAt', key: 'createdAt', name: 'Đặt hàng lúc' }
			],
			initialSort: 'createdAt',
			initialSortDirection: 'desc'
		})
	);

	$effect(() => {
		const setOrders = async () => {
			const orders = await ordersPromise;
			table.baseRows = orders;
			isLoading = false;
		};
		setOrders();
	});
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<h1 class="text-header3 font-bold">Danh sách đơn hàng</h1>
		<p class="text-base-content/60">Xem và quản lý các đơn hàng trong cửa hàng của bạn.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<SearchInput bind:value={table.globalFilter} />
	</AnimatedDiv>
</div>

<TableFilter
	name="status"
	{table}
	options={orderStatusOptions}
	getFilterBtnClass={getOrderStatusBtnClass}
/>

<AnimatedDiv animateVars={{ translateY: 16 }} class="mt-2 rounded-box border bg-base-100 p-4">
	<div class="overflow-x-auto">
		<table class="table table-sm">
			<thead>
				<tr class="text-base-content">
					{#each table.columns as column (column.id)}
						<th>
							<button
								class="flex items-center gap-1"
								onclick={() => table.toggleSort(column.id)}
								disabled={!table.isSortable(column.id)}
							>
								{column.name}
								{#if table.isSortable(column.id)}
									{#if table.getSortState(column.id) === 'asc'}
										<span class="icon-[mingcute--sort-ascending-fill] text-primary-content"></span>
									{:else if table.getSortState(column.id) === 'desc'}
										<span class="icon-[mingcute--sort-descending-fill] text-primary-content"></span>
									{:else}
										<span class="icon-[mingcute--menu-fill] text-base-content/20"></span>
									{/if}
								{/if}
							</button>
						</th>
					{/each}
					<th>Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#if isLoading}
					<tr>
						<td colspan={table.columns.length + 1}>
							<LoadingPlaceholder text="Đang tải danh sách đơn hàng..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'total'}
									<td class="font-serif text-xl font-bold whitespace-nowrap text-success-content"
										>{formatVND(row.total)}</td
									>
								{:else if column.id === 'orderCode'}
									<td class=" max-w-80">
										<div class="flex flex-col gap-2">
											<p class="flex items-center gap-1 font-serif text-lg font-bold">
												<span class="icon-[mingcute--barcode-scan-fill] shrink-0"
												></span>{row.orderCode}
											</p>
											<div class="flex flex-col gap-2">
												{#each row.details as item (item.productId)}
													<div class="flex items-center gap-2">
														<img
															class="h-12 w-12 rounded-field object-cover"
															src={item.productImage}
															alt={item.productName}
														/>
														<div class="flex flex-col">
															<p class="line-clamp-2 font-semibold">{item.productName}</p>
															<p class="text-base-content/60">
																Số lượng: {item.quantity} &nbsp;|&nbsp; Giá:
																{formatVND(item.unitPrice)}
															</p>
														</div>
													</div>
												{/each}
											</div>
										</div>
									</td>
								{:else if column.id === 'createdAt'}
									<td class="font-semibold">
										{row[column.key] && typeof row[column.key] === 'string'
											? formatDateTime(row[column.key] as string)
											: '-'}
									</td>
								{:else if column.id === 'status'}
									<td class="whitespace-nowrap">
										<div class={`badge badge-sm ${getOrderStatusBadgeClass(row.status)}`}>
											{getTitleFromOptionList(row.status, orderStatusOptions)}
										</div>
									</td>
								{:else if column.id === 'customerName'}
									<td>
										<div class="flex flex-col gap-1">
											<p class="text-sm font-bold">{row.customerName ?? 'Không tên'}</p>
											<p
												class="mt-1 line-clamp-1 flex items-center gap-1 text-xs text-base-content/70"
											>
												<span class="icon-[mingcute--user-3-fill] shrink-0"></span>{row.shipToName}
												<span class="ml-4 icon-[mingcute--phone-fill] shrink-0"
												></span>{row.shipToPhone}
											</p>
											<p class="line-clamp-1 flex items-center gap-1 text-xs text-base-content/70">
												<span class="icon-[mingcute--map-pin-fill] shrink-0"></span>
												{row.shipToAddress}
											</p>
										</div>
									</td>
								{:else}
									<td>{row[column.key] ?? '-'}</td>
								{/if}
							{/each}
							<td class="whitespace-nowrap">
								<div class="flex gap-1">
									<div class="tooltip" data-tip="Xem chi tiết">
										<a
											href={resolve(`/seller/orders/${row.id}`)}
											class="btn btn-secondary"
											aria-label="xem chi tiết"
										>
											<span class="icon-[mingcute--document-2-line] text-xl"></span>Chi tiết
										</a>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder text="Không có đơn hàng nào để hiển thị." />
						</td>
					</tr>
				{/if}
			</tbody>
		</table>

		<div class="flex justify-end overflow-hidden">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</AnimatedDiv>
