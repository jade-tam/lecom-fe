<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import RadioInput, { type RadioInputOption } from '$lib/components/ui/RadioInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';

	const { data } = $props();

	const sortByOptions: RadioInputOption[] = [
		{
			label: 'Tên A-Z',
			value: 'name_asc'
		},
		{
			label: 'Tên Z-A',
			value: 'name_desc'
		},
		{
			label: 'Cũ nhất',
			value: 'oldest'
		}
	];

	let search: string | null = $state(null);
	let category: string | null = $state(null);
	let sort: string | null = $state(null);
	let pageNumber: number | null = $state(null);

	$effect(() => {
		search = page.url.searchParams.get('search') ?? null;
		category = page.url.searchParams.get('category') ?? null;
		sort = page.url.searchParams.get('sort') ?? null;
		pageNumber = Number(page.url.searchParams.get('page')) ?? null;
	});

	function handleApplyFilter() {
		const searchParams = new URLSearchParams();
		if (search) searchParams.set('search', search);
		if (category) searchParams.set('category', category);
		if (sort) searchParams.set('sort', sort);
		if (pageNumber) searchParams.set('page', String(pageNumber));

		goto(`./courses?${searchParams.toString()}`, {
			replaceState: true
		});
	}

	function handleClearAllFilter() {
		category = null;
		sort = null;

		const searchParams = new URLSearchParams();
		if (pageNumber) searchParams.set('page', String(pageNumber));

		goto(`./courses?${searchParams.toString()}`, {
			replaceState: true
		});
	}
</script>

<section class="flex min-h-screen flex-col items-center">
	<div class="my-4 flex items-center justify-between self-start">
		{#await data.queryResult}
			<div class="loading loading-infinity"></div>
		{:then queryResult}
			<p>
				Hiển thị <strong>{queryResult.items.length} kết quả</strong>
				{#if search}
					cho <span class="font-bold">
						'{search}'
					</span>
				{/if}
			</p>
		{:catch err}
			<p class="text-error">Lỗi khi tải khóa học</p>
		{/await}
	</div>

	<div class="grid w-full grid-cols-12 gap-2 max-md:grid-cols-1">
		<div class="col-span-3 h-fit rounded-box border bg-base-100 p-4">
			<p class="font-serif text-lg font-bold">Lọc theo danh mục</p>
			<div class="mt-2 flex flex-col gap-2">
				{#await data.categories}
					<div class="loading loading-infinity"></div>
				{:then categories}
					{#if categories.length}
						<RadioInput
							bind:value={category}
							options={categories.map((cat) => ({
								label: cat.name,
								value: cat.slug
							}))}
						/>
					{:else}
						<p class="text-xs text-base-content/60 italic">Không tìm thấy danh mục nào</p>
					{/if}
				{:catch err}
					<p class="text-error">Lỗi khi tải danh mục khóa học</p>
				{/await}

				<!-- =================================== -->
				<div class="divider my-0"></div>
				<p class="font-serif text-lg font-bold text-base-content">Sắp xếp theo</p>
				<div class="mt-1 flex flex-col gap-2">
					<RadioInput bind:value={sort} options={sortByOptions} />
				</div>

				<!-- =================================== -->
				<div class="divider mb-1"></div>
				<button class="btn btn-primary" onclick={handleApplyFilter}>Áp dụng</button>
				<button class="btn" onclick={handleClearAllFilter}>Xóa tất cả</button>
			</div>
		</div>
		<div
			class="col-span-9 grid h-fit w-full grid-cols-3 gap-x-2 gap-y-6 max-lg:grid-cols-2 max-md:grid-cols-2"
		>
			{#await data.queryResult}
				<LoadingPlaceholder text="Đang tải danh sách khóa học..." />>
			{:then result}
				{#if result.items.length}
					{#each result.items as course (course.id)}
						<CourseCard {course} />
					{/each}

					<div class="col-span-full">
						<Pagination
							page={result.page}
							pageSize={result.pageSize}
							totalItems={result.totalItems}
							totalPages={result.totalPages}
							onPageChange={(newPage) => {
								pageNumber = newPage;
								handleApplyFilter();
							}}
						/>
					</div>
				{:else}
					<EmptyPlaceholder text="Không tìm thấy khóa học nào" />
				{/if}
			{:catch err}
				<p class="text-error">Lỗi khi tải khóa học</p>
			{/await}
		</div>
	</div>
</section>
