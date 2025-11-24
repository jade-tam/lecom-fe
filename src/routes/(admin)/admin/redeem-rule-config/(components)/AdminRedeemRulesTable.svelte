<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import type { RedeemRule } from '$lib/types/Gamification';
	import { formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { redeemRulesPromise }: { redeemRulesPromise: Promise<RedeemRule[]> } = $props();
	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as RedeemRule[],
			columns: [
				{ id: 'reward', key: 'reward', name: 'Phiếu giảm giá' },
				{ id: 'costPoints', key: 'costPoints', name: 'Giá xu cần để đổi' },
				{ id: 'active', key: 'active', name: 'Trạng thái' }
			]
		})
	);

	$effect(() => {
		const setRedeemRules = async () => {
			const redeemRules = await redeemRulesPromise;
			table.baseRows = redeemRules;
			isLoading = false;
		};

		setRedeemRules();
	});
</script>

<div class="my-2 flex flex-wrap items-end justify-between gap-2">
	<AnimatedDiv class="flex flex-col" animateVars={{ translateX: -20 }}>
		<h1 class="text-header3 font-bold">Cài đặt mục đổi thưởng</h1>
		<p class="text-base-content/60">Xem và quản lý các mục đổi thưởng trên hệ thống.</p>
	</AnimatedDiv>
	<AnimatedDiv class="flex gap-2" animateVars={{ translateX: 20 }}>
		<SearchInput bind:value={table.globalFilter} />
		<a href={resolve('/admin/redeem-rule-config/create')} class="btn btn-primary">
			<span class="icon-[mingcute--add-fill]"></span>Tạo mục đổi thưởng
		</a>
	</AnimatedDiv>
</div>

<AnimatedDiv class="rounded-box border bg-base-100 p-4" animateVars={{ translateY: 24 }}>
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
								{#if table.isSortable(column.id)}
									<span class="ml-2">
										{#if table.getSortState(column.id) === 'asc'}
											<span class="icon-[fa7-solid--sort-asc]"></span>
										{:else if table.getSortState(column.id) === 'desc'}
											<span class="icon-[fa7-solid--sort-desc]"></span>
										{/if}
									</span>
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
							<LoadingPlaceholder text="Đang tải danh sách mục đổi thưởng..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'costPoints'}
									<td class="font-serif font-bold">
										<div class="flex items-center gap-1 text-lg text-primary-content">
											{row.costPoints}<span class="icon-[mingcute--copper-coin-fill]"></span>
										</div></td
									>
								{:else if column.id === 'reward'}
									<td class="font-serif text-2xl font-black">
										{row.reward}
									</td>
								{:else if column.id === 'active'}
									<td>
										<div class={`badge ${row.active ? 'badge-success' : 'badge-error'}`}>
											{row.active ? 'Đang hoạt động' : 'Không hoạt động'}
										</div>
									</td>
								{:else}
									<td>{row[column.key]}</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									<div class="tooltip" data-tip="Chỉnh sửa">
										<a
											href={resolve(`/admin/redeem-rule-config/${row.id}/update`)}
											class="btn btn-square btn-warning"
											type="button"
											aria-label="Chỉnh sửa"
										>
											<span class="icon-[mingcute--edit-4-fill] text-2xl"></span>
										</a>
									</div>
									<FormConfirmDropdownAction
										label={`Xóa mục đổi thưởng ${row.reward}?`}
										description="Mục này sẽ bị xóa vĩnh viễn"
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
							<EmptyPlaceholder text="Không có mục đổi thưởng nào để hiển thị." />
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
