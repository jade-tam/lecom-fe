<script lang="ts">
	const {
		totalItems,
		page,
		pageSize,
		totalPages,
		onPageChange
	}: {
		totalItems: number;
		page: number;
		pageSize: number;
		totalPages: number;
		onPageChange?: (page: number) => void;
	} = $props();

	const startItemNumber = $derived((page - 1) * pageSize + 1);
	const endItemNumber = $derived(Math.min(page * pageSize, totalItems));

	const visiblePages = $derived.by(() => {
		const first = [1];
		const last = [totalPages];
		const windowStart = Math.max(1, page - 2);
		const windowEnd = Math.min(totalPages, page + 2);

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

	function handlePageClick(p: number | string) {
		if (typeof p === 'number' && p !== page) {
			onPageChange?.(p);
		}
	}
</script>

<div class="flex items-center justify-between gap-4">
	<p class="text-sm opacity-60">
		Đang hiển thị sản phẩm <strong>{startItemNumber}</strong> - <strong>{endItemNumber}</strong> trên tổng số <strong>{totalItems}</strong>
	</p>

	<div class="join">
		<!-- Previous button -->
		<button
			class="btn join-item btn-square"
			aria-label="Prev page"
			disabled={page <= 1}
			onclick={() => handlePageClick(page - 1)}
		>
			<span class="icon-[fa7-solid--chevron-left]"></span>
		</button>

		<!-- Page buttons -->
		{#each visiblePages as p}
			{#if p === '...'}
				<button class="btn-disabled btn join-item btn-square">...</button>
			{:else}
				<button
					class="btn join-item btn-square {page === p ? 'btn-active btn-primary' : ''}"
					onclick={() => handlePageClick(p)}
				>
					{p}
				</button>
			{/if}
		{/each}

		<!-- Next button -->
		<button
			class="btn join-item btn-square"
			disabled={page >= totalPages}
			onclick={() => handlePageClick(page + 1)}
			aria-label="Next page"
		>
			<span class="icon-[fa7-solid--chevron-right]"></span>
		</button>
	</div>
</div>
