<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { discountTypeOptions, type Voucher } from '$lib/types/Voucher';
	import { formatDate, formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { vouchersPromise }: { vouchersPromise: Promise<Voucher[]> } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as Voucher[],
			columns: [
				{ id: 'code', key: 'code', name: 'Mã voucher' },
				{ id: 'discountType', key: 'discountType', name: 'Loại giảm giá' },
				{ id: 'discountValue', key: 'discountValue', name: 'Giá trị giảm' },
				{ id: 'maxDiscountAmount', key: 'maxDiscountAmount', name: 'Giảm tối đa' },
				{ id: 'minOrderAmount', key: 'minOrderAmount', name: 'Đơn tối thiểu' },
				{ id: 'quantityAvailable', key: 'quantityAvailable', name: 'Còn lại' },
				{ id: 'startDate', key: 'startDate', name: 'Hiệu lực từ' },
				{ id: 'endDate', key: 'endDate', name: 'Hết hiệu lực' },
				{ id: 'isActive', key: 'isActive', name: 'Trạng thái' }
			]
		})
	);

	$effect(() => {
		const setVouchers = async () => {
			const vouchers = await vouchersPromise;
			table.baseRows = vouchers;
			isLoading = false;
		};

		setVouchers();
	});
</script>

<div class="my-2 flex flex-wrap items-end justify-between gap-2">
	<AnimatedDiv class="flex flex-col" animateVars={{ translateX: -20 }}>
		<h1 class="text-header3 font-bold">Cài đặt phiếu giảm giá</h1>
		<p class="text-base-content/60">Xem và quản lý các phiếu giảm giá trên hệ thống.</p>
	</AnimatedDiv>
	<AnimatedDiv class="flex gap-2" animateVars={{ translateX: 20 }}>
		<SearchInput bind:value={table.globalFilter} />
		<a href={resolve('/admin/voucher-config/create')} class="btn btn-primary">
			<span class="icon-[mingcute--add-fill]"></span>Tạo mã giảm giá
		</a>
	</AnimatedDiv>
</div>

<AnimatedDiv class="rounded-box border bg-base-100 p-4" animateVars={{ translateY: 24 }}>
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
							<LoadingPlaceholder text="Đang tải danh sách phiếu giảm giá..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'startDate' || column.id === 'endDate'}
									<td>{formatDate(row[column.key] as string)}</td>
								{:else if column.id === 'code'}
									<td class="font-serif text-xl font-black">
										{row.code}
									</td>
								{:else if column.id === 'discountValue'}
									<td class="font-serif text-lg font-bold">
										{row.discountType === 'Percentage'
											? `${row.discountValue}%`
											: formatVND(row.discountValue)}
									</td>
								{:else if column.id === 'maxDiscountAmount' || column.id === 'minOrderAmount'}
									<td class="font-serif font-bold">
										{row[column.key] !== null ? formatVND(row[column.key] as number) : '---'}
									</td>
								{:else if column.id === 'isActive'}
									<td>
										<div
											class={`badge  badge-xs ${row.isActive ? 'badge-success' : 'badge-error'}`}
										>
											{row.isActive ? 'Hoạt động' : 'Hết hiệu lực'}
										</div>
									</td>
								{:else if column.id === 'discountType'}
									<td>
										{discountTypeOptions.find((opt) => opt.value === row.discountType)?.title}
									</td>
								{:else}
									<td>{row[column.key]}</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									<div class="tooltip" data-tip="Xem chi tiết">
										<a
											href={resolve(`/admin/voucher-config/${row.id}`)}
											class="btn btn-square btn-secondary"
											type="button"
											aria-label="Xem chi tiết"
										>
											<span class="icon-[mingcute--eye-fill] text-2xl"></span>
										</a>
									</div>
									<div class="tooltip" data-tip="Chỉnh sửa">
										<a
											href={resolve(`/admin/voucher-config/${row.id}/update`)}
											class="btn btn-square btn-warning"
											type="button"
											aria-label="Chỉnh sửa"
										>
											<span class="icon-[mingcute--edit-4-fill] text-2xl"></span>
										</a>
									</div>
									<FormConfirmDropdownAction
										label={`Xóa voucher ${row.code}?`}
										description="Voucher này sẽ bị xóa vĩnh viễn"
										action="?/delete"
										formData={{ id: row.id }}
									>
										<div class="tooltip" data-tip="Xóa">
											<button class="btn btn-square btn-error" type="button" aria-label="xóa">
												<span class="icon-[mingcute--delete-2-fill] text-2xl"></span>
											</button>
										</div>
									</FormConfirmDropdownAction>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder text="Không có voucher nào để hiển thị." />
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
