<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import OpenModalButton from '$lib/components/modal/OpenModalButton.svelte';
	import ReviewRefundModalContent from '$lib/components/modal/ReviewRefundModalContent.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import { refundReasonTypeOptions, refundStatusOptions, type Refund } from '$lib/types/Refund';
	import { getRefundStatusClass } from '$lib/utils/classComposer';
	import { formatDateTime, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const {
		refundsPromise,
		reviewRefundFormData
	}: { refundsPromise: Promise<Refund[]>; reviewRefundFormData: any } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as Refund[],
			columns: [
				// { id: 'orderCode', key: 'orderCode', name: 'Mã đơn hàng' },
				{ id: 'requestedByName', key: 'requestedByName', name: 'Khách hàng yêu cầu' },
				{ id: 'reasonType', key: 'reasonType', name: 'Lý do hoàn tiền' },
				{ id: 'refundAmount', key: 'refundAmount', name: 'Số tiền hoàn' },
				{ id: 'requestedAt', key: 'requestedAt', name: 'Thời gian yêu cầu' },
				{ id: 'shopResponseByName', key: 'shopResponseByName', name: 'Người bán xử lý' },
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
			<h1 class="text-header3 font-bold">Tổng quan yêu cầu hoàn tiền</h1>
		</div>
		<p class="text-base-content/60">
			Xét duyệt các yêu cầu hoàn tiền đang chờ xử lý giữa khách hàng và cửa hàng.
		</p>
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
									<td>{formatDateTime(row.requestedAt)}</td>
								{:else if column.id === 'reasonType'}
									<td>
										<div class="flex flex-col gap-1">
											<span class="font-bold"
												>{getTitleFromOptionList(row.reasonType, refundReasonTypeOptions)}</span
											>
											{#if row.reasonDescription}
												<span class="text-xs text-base-content/70">{row.reasonDescription}</span>
											{/if}
											{#if row.attachmentUrls}
												<Image
													src={row.attachmentUrls}
													alt="Minh chứng hoàn tiền"
													class="rounded-object mt-1 h-20 w-32 object-cover"
												/>
											{/if}
										</div>
									</td>
								{:else if column.id === 'status'}
									<td>
										<div class={`badge badge-sm ${getRefundStatusClass(row.status, 'badge')}`}>
											{getTitleFromOptionList(row.status, refundStatusOptions)}
										</div>
									</td>
								{:else if column.id === 'shopResponseByName'}
									<td>
										{#if row.shopResponseByName}
											<span class="font-bold text-secondary-content">{row.shopResponseByName}</span>
										{:else}
											<span class="text-base-content/60 italic">Chưa xử lý</span>
										{/if}
									</td>
								{:else if column.id === 'requestedByName'}
									<td>
										<span class="font-bold">{row.requestedByName}</span>
									</td>
								{:else}
									<td>{row[column.key] ?? '-'}</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									{#if row.status === 'PendingShop' || row.status === 'PendingAdmin'}
										<div class="tooltip tooltip-left" data-tip="Xét duyệt hoàn tiền">
											<OpenModalButton
												openButtonProps={{ class: 'btn btn-warning ' }}
												ModalContent={ReviewRefundModalContent}
												ModalContentProps={{
													dataForm: reviewRefundFormData,
													refund: row,
													isAdminView: true
												}}
											>
												<span class="icon-[mingcute--checkbox-line] text-xl"></span>Xét duyệt
											</OpenModalButton>
										</div>
									{/if}
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
