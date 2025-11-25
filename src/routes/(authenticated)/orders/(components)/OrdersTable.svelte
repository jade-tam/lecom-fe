<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import { orderStatusOptions, type Order } from '$lib/types/Order';
	import { getOrderStatusBadgeClass, getOrderStatusBtnClass } from '$lib/utils/classComposer';
	import { formatDate, formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { orders }: { orders: Order[] } = $props();

	const pageSize = 6;

	const table = new DataTable({
		pageSize: pageSize,
		data: orders,
		columns: [
			{ id: 'details', key: 'details', name: 'Sản phẩm', sortable: false },
			{ id: 'shopName', key: 'shopName', name: 'Cửa hàng', sortable: false },
			{ id: 'status', key: 'status', name: 'Trạng thái đơn' },
			{ id: 'createdAt', key: 'createdAt', name: 'Đặt hàng lúc' }
		],
		initialSort: 'createdAt',
		initialSortDirection: 'desc'
	});

	function getOrderStatusTitle(status: string) {
		const found = orderStatusOptions.find((opt) => opt.value === status);
		return found ? found.title : status;
	}
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<h1 class="text-header3 font-bold">Lịch sử đơn hàng</h1>
		<p class="text-base-content/60">Xem lịch sử và trạng thái các đơn hàng của bạn.</p>
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
		<table class="table">
			<thead>
				<tr class="text-base-content">
					{#each table.columns as column (column.id)}
						<th>
							<button
								class="flex items-center"
								onclick={() => table.toggleSort(column.id)}
								disabled={!table.isSortable(column.id)}
							>
								{column.name}
								<!-- SORT BUTTON -->
								{#if table.isSortable(column.id)}
									<span class="ml-2">
										{#if table.getSortState(column.id) === 'asc'}
											<span class="icon-[fa7-solid--sort-asc]"></span>
										{:else if table.getSortState(column.id) === 'desc'}
											<span class="icon-[fa7-solid--sort-desc]"></span>
										{:else}{/if}
									</span>
								{/if}
							</button>
						</th>
					{/each}
					<th>Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'total'}
								<td class="font-serif text-xl font-bold">{formatVND(row.total)}</td>
							{:else if column.id === 'details'}
								<td>
									<div class="flex flex-col gap-2">
										{#each row.details as item (item.productId)}
											<div class="flex items-center gap-2">
												<Image
													class="rounded-object h-12 w-12 object-cover"
													src={item.productImage}
													alt={item.productName}
												/>
												<div class="flex flex-col">
													<p class="font-semibold">{item.productName}</p>
													<p class="text-sm text-base-content/60">
														Số lượng: {item.quantity} &nbsp;|&nbsp; Giá:
														{formatVND(item.unitPrice)}
													</p>
												</div>
											</div>
										{/each}
									</div>
								</td>
							{:else if column.id === 'createdAt' || column.id === 'completedAt'}
								<td>
									{row[column.key] && typeof row[column.key] === 'string'
										? formatDate(row[column.key] as string)
										: '-'}
								</td>
							{:else if column.id === 'status'}
								<td>
									<div class={`badge ${getOrderStatusBadgeClass(row.status)}`}>
										{getOrderStatusTitle(row.status)}
									</div>
								</td>
							{:else}
								<td>{row[column.key] ?? '-'}</td>
							{/if}
						{/each}
						<td>
							<div class="flex gap-1">
								<div class="tooltip" data-tip="Xem chi tiết">
									<a href={`/orders/${row.id}`} class="btn btn-secondary" aria-label="xem chi tiết">
										<span class="icon-[fa7-solid--eye] text-xl"></span>Xem chi tiết
									</a>
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex justify-end overflow-hidden">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</AnimatedDiv>
