<script lang="ts">
	import type { DataTable } from '@careswitch/svelte-data-table';

	const {
		table,
		pageSize
	}: {
		table: DataTable<any>;
		pageSize: number;
	} = $props();

	const totalPages = $derived(table.totalPages);
	const currentPage = $derived(table.currentPage);
	const totalItems = $derived(table.allRows.length);

	const startItemNumber = $derived((currentPage - 1) * pageSize + 1);
	const endItemNumber = $derived(Math.min(currentPage * pageSize, totalItems));

	const visiblePages = $derived.by(() => {
		const first = [1];
		const last = [totalPages];
		const windowStart = Math.max(1, currentPage - 2);
		const windowEnd = Math.min(totalPages, currentPage + 2);

		const windowPages: number[] = [];
		for (let i = windowStart; i <= windowEnd; i++) windowPages.push(i);

		const all = Array.from(new Set([...first, ...windowPages, ...last]))
			.filter((p) => p >= 1 && p <= totalPages)
			.sort((a, b) => a - b);

		const result: (number | string)[] = [];
		for (let i = 0; i < all.length; i++) {
			if (i > 0 && (all[i] as number) - (all[i - 1] as number) > 1) result.push('...');
			result.push(all[i]);
		}
		return result;
	});

	function handlePageClick(page: number | string) {
		if (typeof page === 'number' && page !== currentPage) table.currentPage = page;
	}
</script>

<div class="mt-4 flex items-center justify-between gap-4">
	<p class="text-sm opacity-60">
		Hiển thị {startItemNumber} - {endItemNumber} trên {totalItems} kết quả
	</p>

	<div class="join">
		{#each visiblePages as page}
			{#if page === '...'}
				<button class="btn btn-disabled join-item">...</button>
			{:else}
				<button
					class="btn join-item {currentPage === page ? 'btn-active btn-primary' : ''}"
					onclick={() => handlePageClick(page)}
				>
					{page}
				</button>
			{/if}
		{/each}
	</div>
</div>
