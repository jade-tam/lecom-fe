<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { orderStatusOptions, type Order } from '$lib/types/Order';
	import {
		getOrderStatusBadgeClass,
		getOrderStatusBtnClass,
		getPaymentStatusBadgeClass
	} from '$lib/utils/classComposer';
	import { formatDate, formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { orders }: { orders: Order[] } = $props();

	const pageSize = 6;

	const table = new DataTable({
		pageSize: pageSize,
		data: orders,
		columns: [
			// { id: 'orderCode', key: 'orderCode', name: 'Mã đơn hàng' },
			{ id: 'shopName', key: 'shopName', name: 'Cửa hàng' },
			{ id: 'customerName', key: 'customerName', name: 'Khách hàng' },
			{ id: 'shipToName', key: 'shipToName', name: 'Người nhận' },
			{ id: 'total', key: 'total', name: 'Tổng tiền' },
			{ id: 'status', key: 'status', name: 'Trạng thái đơn' },
			{ id: 'paymentStatus', key: 'paymentStatus', name: 'Thanh toán' },
			{ id: 'createdAt', key: 'createdAt', name: 'Ngày tạo' },
			{ id: 'completedAt', key: 'completedAt', name: 'Ngày hoàn thành' }
		]
	});
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Lịch sử đơn hàng</h1>
		<p class="text-base-content/60">Xem, chỉnh sửa và quản lý các đơn hàng của bạn.</p>
	</div>

	<div class="flex gap-2">
		<SearchInput bind:value={table.globalFilter} />
	</div>
</div>

<TableFilter
	name="status"
	{table}
	options={orderStatusOptions}
	getFilterBtnClass={getOrderStatusBtnClass}
/>

<div class="mt-2 rounded-box border bg-base-100 p-4">
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
								<td>{formatVND(row.total)}</td>
							{:else if column.id === 'createdAt' || column.id === 'completedAt'}
								<td>
									{row[column.key] && typeof row[column.key] === 'string'
										? formatDate(row[column.key] as string)
										: '-'}
								</td>
							{:else if column.id === 'status'}
								<td>
									<div class={`badge ${getOrderStatusBadgeClass(row.status)}`}>{row.status}</div>
								</td>
							{:else if column.id === 'paymentStatus'}
								<td>
									<div class={`badge ${getPaymentStatusBadgeClass(row.paymentStatus)}`}>
										{row.paymentStatus}
									</div>
								</td>
							{:else}
								<td>{row[column.key] ?? '-'}</td>
							{/if}
						{/each}
						<td>
							<div class="flex gap-1">
								<div class="tooltip" data-tip="Xem chi tiết">
									<a
										href={`/orders/${row.id}`}
										class="btn btn-square btn-secondary"
										aria-label="xem chi tiết"
										target="_blank"
									>
										<span class="icon-[fa7-solid--eye] text-xl"></span>
									</a>
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</div>
