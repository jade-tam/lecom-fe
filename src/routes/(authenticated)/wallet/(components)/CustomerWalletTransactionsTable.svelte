<script lang="ts">
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import {
		walletTransactionBalanceTypeOptions,
		walletTransactionTypeOptions,
		type WalletTransaction
	} from '$lib/types/Wallet';
	import {
		getWalletTransactionBalanceTypeClass,
		getWalletTransactionTypeClass
	} from '$lib/utils/classComposer';
	import { formatDateTime, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { walletTransactionsDataPromise }: { walletTransactionsDataPromise: Promise<any> } =
		$props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as WalletTransaction[],
			columns: [
				{ id: 'createdAt', key: 'createdAt', name: 'Thời gian', sortable: true },
				{ id: 'type', key: 'type', name: 'Loại giao dịch', sortable: true },
				{ id: 'amount', key: 'amount', name: 'Thay đổi', sortable: true },
				{ id: 'balanceBefore', key: 'balanceBefore', name: 'Số dư trước', sortable: false },
				{ id: 'balanceAfter', key: 'balanceAfter', name: 'Số dư sau', sortable: false },
				{ id: 'description', key: 'description', name: 'Mô tả', sortable: false },
				{ id: 'performedBy', key: 'performedBy', name: 'Thực hiện bởi', sortable: false }
			],
			initialSort: 'createdAt',
			initialSortDirection: 'desc'
		})
	);

	$effect(() => {
		const setTransactions = async () => {
			const transactionData = await walletTransactionsDataPromise;
			table.baseRows = transactionData ? transactionData.transactions : [];
			isLoading = false;
		};
		setTransactions();
	});
</script>

<div class="flex justify-between">
	<h2 class="text-header3 mb-2 flex items-center gap-2">
		<span class="icon-[mingcute--paper-2-line]"></span>Lịch sử giao dịch
	</h2>

	<TableFilter
		name="type"
		{table}
		options={walletTransactionTypeOptions}
		getFilterBtnClass={(type) => getWalletTransactionTypeClass(type, 'btn')}
	/>
</div>

<div class="mt-2 overflow-x-auto">
	<table class="table table-xs">
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
			</tr>
		</thead>
		<tbody>
			{#if isLoading}
				<tr>
					<td colspan={table.columns.length}>
						<LoadingPlaceholder text="Đang tải lịch sử giao dịch..." />
					</td>
				</tr>
			{:else if table.baseRows.length}
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'createdAt'}
								<td class="font-semibold whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
							{:else if column.id === 'type'}
								<td>
									<div class="badge badge-sm {getWalletTransactionTypeClass(row.type, 'badge')}">
										{getTitleFromOptionList(row.type, walletTransactionTypeOptions)}
									</div>
								</td>
							{:else if column.id === 'amount'}
								<td
									class="font-serif text-sm font-bold {row.amount > 0
										? 'text-success-content'
										: 'text-error-content'}"
								>
									{row.amount > 0 ? '+' : ''}{formatVND(row.amount)}
								</td>
							{:else if column.id === 'balanceBefore'}
								<td class="font-serif text-xs font-bold text-base-content/70">{formatVND(row.balanceBefore)}</td>
							{:else if column.id === 'balanceAfter'}
								<td class="font-serif text-xs font-bold text-base-content/70">{formatVND(row.balanceAfter)}</td>
							{:else if column.id === 'balanceType'}
								<td>
									<div
										class="badge badge-sm {getWalletTransactionBalanceTypeClass(
											row.balanceType,
											'badge'
										)}"
									>
										{getTitleFromOptionList(row.balanceType, walletTransactionBalanceTypeOptions)}
									</div>
								</td>
							{:else if column.id === 'description'}
								<td class="max-w-xs line-clamp-2">{row.description ?? '-'}</td>
							{:else if column.id === 'performedBy'}
								<td>{row.performedBy ?? '-'}</td>
							{:else}
								<td>{row[column.key] ?? '-'}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			{:else}
				<tr>
					<td colspan={table.columns.length}>
						<EmptyPlaceholder text="Không có giao dịch nào để hiển thị." />
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
	<div class="flex justify-end overflow-hidden">
		<TablePagination {table} {pageSize} />
	</div>
</div>
