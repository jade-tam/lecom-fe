<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import { withdrawalStatusOptions, type Withdrawal } from '$lib/types/Withdrawal';
	import { getWithdrawalStatusClass } from '$lib/utils/classComposer';
	import { formatDateTime, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { withdrawalsPromise }: { withdrawalsPromise: Promise<Withdrawal[]> } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as Withdrawal[],
			columns: [
				{ id: 'id', key: 'id', name: 'Mã yêu cầu' },
				{ id: 'amount', key: 'amount', name: 'Số tiền rút' },
				{ id: 'bankName', key: 'bankName', name: 'Ngân hàng' },
				{ id: 'bankAccountNumber', key: 'bankAccountNumber', name: 'Số tài khoản' },
				{ id: 'bankAccountName', key: 'bankAccountName', name: 'Chủ tài khoản' },
				{ id: 'status', key: 'status', name: 'Trạng thái' },
				{ id: 'requestedAt', key: 'requestedAt', name: 'Thời gian yêu cầu' },
				{ id: 'approvedAt', key: 'approvedAt', name: 'Duyệt lúc' },
				{ id: 'completedAt', key: 'completedAt', name: 'Hoàn tất lúc' },
				{ id: 'note', key: 'note', name: 'Ghi chú' }
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
		<TableFilter
			name="status"
			{table}
			options={withdrawalStatusOptions}
			getFilterBtnClass={(status) => getWithdrawalStatusClass(status, 'btn')}
		/>

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
						<td colspan={table.columns.length}>
							<LoadingPlaceholder text="Đang tải danh sách rút tiền..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'amount'}
									<td class="font-serif text-base font-bold text-success-content"
										>{formatVND(row.amount)}</td
									>
								{:else if column.id === 'requestedAt' || column.id === 'approvedAt' || column.id === 'completedAt'}
									<td class="font-semibold">
										{#if row[column.key]}
											{formatDateTime(row[column.key] as string)}
										{:else}
											<span class="text-base-content/60 italic">---</span>
										{/if}
									</td>
								{:else if column.id === 'status'}
									<td class="whitespace-nowrap">
										<div class={`badge badge-xs ${getWithdrawalStatusClass(row.status, 'badge')}`}>
											{getTitleFromOptionList(row.status, withdrawalStatusOptions)}
										</div>
									</td>
								{:else if column.id === 'bankAccountNumber'}
									<td class="text-xs font-bold">
										{row[column.key]}
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
									<div class="tooltip tooltip-left" data-tip="Xem chi tiết">
										<a
											href={resolve(`/(authenticated)/wallet/withdraw/[id]`, { id: row.id })}
											class="btn btn-square btn-secondary"
											type="button"
											aria-label="Xem chi tiết"
										>
											<span class="icon-[mingcute--document-2-line] text-xl"></span>
										</a>
									</div>
									{#if row.status === 'Pending'}
										<div class="tooltip tooltip-left" data-tip="Huỷ yêu cầu">
											<FormConfirmPopoverButton
												action="?/cancelWithdrawal"
												formData={{ withdrawalId: row.id }}
												popoverId="cancel-withdrawal-{row.id}"
												openButtonProps={{
													class: 'btn btn-square btn-error',
													type: 'button',
													'aria-label': 'Huỷ yêu cầu'
												}}
												dropdownContent={{
													label: 'Huỷ yêu cầu?',
													description: 'Yêu cầu rút tiền của bạn sẽ bị huỷ',
													confirmBtnClass: 'btn-error',
													confirmBtnIcon: 'icon-[mingcute--close-circle-line]',
													confirmBtnText: 'Xác nhận'
												}}
											>
												<span class="icon-[mingcute--delete-2-line] text-xl"></span>
											</FormConfirmPopoverButton>
										</div>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length}>
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
