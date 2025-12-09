<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import { refundReasonTypeOptions, refundStatusOptions, type Refund } from '$lib/types/Refund';
	import { getRefundStatusClass } from '$lib/utils/classComposer';
	import { formatDate, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { refundsPromise }: { refundsPromise: Promise<Refund[]> } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as Refund[],
			columns: [
				{ id: 'orderCode', key: 'orderCode', name: 'Mã đơn hàng' },
				{ id: 'refundAmount', key: 'refundAmount', name: 'Số tiền đơn' },
				// { id: 'requestedByName', key: 'requestedByName', name: 'Người yêu cầu' },
				{ id: 'reasonType', key: 'reasonType', name: 'Lý do' },
				{ id: 'requestedAt', key: 'requestedAt', name: 'Thời gian yêu cầu' },
				{ id: 'status', key: 'status', name: 'Trạng thái' }
			],
			initialSort: 'requestedAt',
			initialSortDirection: 'desc'
		})
	);

	$effect(() => {
		const setRefunds = async () => {
			const refunds = await refundsPromise;
			table.baseRows = refunds;
			isLoading = false;
		};
		setRefunds();
	});
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-header3 font-bold">Yêu cầu hoàn tiền</h1>
		</div>
		<p class="text-base-content/60">Xem và quản lý các yêu cầu hoàn tiền của bạn.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<SearchInput bind:value={table.globalFilter} />
	</AnimatedDiv>
</div>

<TableFilter
	name="status"
	{table}
	options={refundStatusOptions}
	getFilterBtnClass={(status) => {
		switch (status) {
			case 'PendingShop':
				return 'btn-warning';
			case 'PendingAdmin':
				return 'btn-info';
			case 'Refunded':
				return 'btn-success';
			default:
				return 'btn-secondary';
		}
	}}
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
							<LoadingPlaceholder text="Đang tải danh sách hoàn tiền..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'orderCode'}
									<td class="font-serif text-lg font-bold">{row.orderCode}</td>
								{:else if column.id === 'refundAmount'}
									<td class="font-serif text-lg font-bold text-success-content"
										>{formatVND(row.refundAmount)}</td
									>
								{:else if column.id === 'requestedAt'}
									<td>{formatDate(row.requestedAt)}</td>
								{:else if column.id === 'reasonType'}
									<td
										><div class="flex flex-col">
											<p>{getTitleFromOptionList(row.reasonType, refundReasonTypeOptions)}</p>
											<p class="line-clamp-2 text-xs text-base-content/70">
												{row.reasonDescription}
											</p>
										</div></td
									>
								{:else if column.id === 'status'}
									<td>
										<div class={`badge ${getRefundStatusClass(row.status, 'badge')}`}>
											{getTitleFromOptionList(row.status, refundStatusOptions)}
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
											href={resolve(`/orders/[id]`, {
												id: row.orderId
											})}
											class="btn btn-secondary"
											aria-label="xem chi tiết"
										>
											<span class="icon-[mingcute--document-2-line] text-xl"></span>Chi tiết đơn
										</a>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder text="Không có yêu cầu hoàn tiền nào để hiển thị." />
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
