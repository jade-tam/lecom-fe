<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import { withdrawalStatusOptions, type AdminCustomerWithdrawal } from '$lib/types/Withdrawal';
	import { formatDateTime, formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { withdrawalsPromise }: { withdrawalsPromise: Promise<AdminCustomerWithdrawal[]> } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as AdminCustomerWithdrawal[],
			columns: [
				{ id: 'id', key: 'id', name: 'Mã yêu cầu' },
				{ id: 'customerName', key: 'customerName', name: 'Khách hàng' },
				{ id: 'amount', key: 'amount', name: 'Số tiền rút' },
				{ id: 'bankName', key: 'bankName', name: 'Ngân hàng' },
				{ id: 'bankAccountNumber', key: 'bankAccountNumber', name: 'Số tài khoản' },
				{ id: 'bankAccountName', key: 'bankAccountName', name: 'Chủ tài khoản' },
				{ id: 'bankBranch', key: 'bankBranch', name: 'Chi nhánh' },
				{ id: 'requestedAt', key: 'requestedAt', name: 'Thời gian yêu cầu' },
				{ id: 'note', key: 'note', name: 'Ghi chú' },
				{ id: 'customerWallet', key: 'customerWallet', name: 'Số dư ví' }
			]
		})
	);

	$effect(() => {
		const setWithdrawals = async () => {
			const withdrawals = await withdrawalsPromise;
			table.baseRows = withdrawals;
			isLoading = false;
		};
		setWithdrawals();
	});
</script>

<AnimatedDiv class="rounded-box border bg-base-100 p-4" animateVars={{ translateY: 24 }}>
	<div class="mb-2 flex flex-wrap items-start justify-between gap-2">
		<div><SearchInput bind:value={table.globalFilter} /></div>
	</div>

	<div class="overflow-x-auto">
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
					<th>Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#if isLoading}
					<tr>
						<td colspan={table.columns.length + 1}>
							<LoadingPlaceholder text="Đang tải danh sách rút tiền..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'amount'}
									<td class="font-serif text-base font-bold text-success-content">
										{formatVND(row.amount)}
									</td>
								{:else if column.id === 'requestedAt'}
									<td class="font-semibold">
										{#if row.requestedAt}
											{formatDateTime(row.requestedAt)}
										{:else}
											<span class="text-base-content/60 italic">---</span>
										{/if}
									</td>
								{:else if column.id === 'bankAccountNumber'}
									<td class="font-bold text-xs">
										{row.bankAccountNumber}
									</td>
								{:else if column.id === 'bankName'}
									<td class="font-semibold">
										<div class="flex flex-col">
											<span>{row.bankName}</span>
											<span class="text-base-content/70">
												CN: {row.bankBranch}
											</span>
										</div>
									</td>
								{:else if column.id === 'customerWallet'}
									<td class="whitespace-nowrap">
										<div>
											<span class="font-bold text-success-content"
												>Số dư: {formatVND(row.customerWallet.balance)}</span>
										</div>
									</td>
								{:else}
									<td>
										{#if row[column.key]}
											{row[column.key]}
										{:else}
											<span class="text-base-content/60 italic">---</span>
										{/if}
									</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									<div class="tooltip tooltip-left" data-tip="Xem chi tiết và xét duyệt">
										<a
											href={resolve(`/(admin)/admin/withdrawal-review/customers/[id]`, { id: row.id })}
											class="btn btn-square btn-primary"
											type="button"
											aria-label="Xem chi tiết và xét duyệt"
										>
											<span class="icon-[mingcute--file-check-line] text-xl"></span>
										</a>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder text="Không có yêu cầu rút tiền nào để hiển thị." />
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</AnimatedDiv>
