<script>
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { getUserProfile } from '$lib/context/appContext.js';

	const { data } = $props();
	const userProfile = getUserProfile();
</script>

{#if userProfile}
	<section class="mt-8 flex flex-col">
		<h2 class="text-header3">Khóa học đề xuất dành cho bạn</h2>
		<div class="mt-6 grid w-full grid-cols-4 items-stretch gap-2 gap-y-6">
			{#await data.courseBrowseDataPromise}
				<LoadingPlaceholder text="Đang tải danh sách khóa học" />
			{:then browseData}
				{#if browseData?.recommendedCourses?.length}
					{#each browseData.recommendedCourses as course, index (course.id)}
						<CourseCard {course} {index} />
					{/each}
				{:else}
					<EmptyPlaceholder text="Không có khóa học nào được đề xuất" />
				{/if}
			{:catch err}
				<p class="text-error">Có lỗi xảy ra trong khi đang tải khóa học đề xuất</p>
			{/await}
		</div>
	</section>

	<section class="mt-8 flex flex-col">
		<h2 class="text-header3">Các khóa học mới nhất</h2>
		<div class="mt-6 grid w-full grid-cols-4 items-stretch gap-2 gap-y-6">
			{#await data.courseBrowseDataPromise}
				<LoadingPlaceholder text="Đang tải danh sách khóa học" />
			{:then browseData}
				{#if browseData?.newArrivalCourses?.length}
					{#each browseData.newArrivalCourses as course, index (course.id)}
						<CourseCard {course} {index} />
					{/each}
				{:else}
					<EmptyPlaceholder text="Không có khóa học mới nào" />
				{/if}
			{:catch err}
				<p class="text-error">Có lỗi xảy ra trong khi đang tải khóa học mới</p>
			{/await}
		</div>
	</section>

	{#await data.courseBrowseDataPromise}
		<LoadingPlaceholder text="Đang tải danh sách khóa học" />
	{:then browseData}
		{#if browseData?.recommendedCategories?.length}
			{#each browseData.recommendedCategories as category (category.id)}
				<section class="mt-8 flex flex-col">
					<div class="flex items-center gap-4">
						<h2 class="text-header3">{category.name}</h2>
						<a href="/learning/courses?category={category.slug}" class="btn btn-xs"
							>Xem tất cả <span class="icon-[mingcute--arrow-right-fill]"></span></a
						>
					</div>
					<div class="mt-6 grid w-full grid-cols-4 items-stretch gap-2">
						{#if category.courses.length}
							{#each category.courses as course, index (course.id)}
								<CourseCard {course} {index} />
							{/each}
						{:else}
							<EmptyPlaceholder text="Không có khóa học nào trong danh mục này" />
						{/if}
					</div>
				</section>
			{/each}
		{:else}
			<EmptyPlaceholder text="Không có danh mục nào được đề xuất" />
		{/if}
	{:catch err}
		<p class="text-error">Có lỗi xảy ra trong khi đang tải danh mục đề xuất</p>
	{/await}
{/if}

<section class="mt-8 flex flex-col">
	<h2 class="text-header3">Khám phá các danh mục khóa học</h2>
	<div class="mt-6 flex gap-2 self-start">
		{#await data.categories}
			<div class="btn w-32 skeleton rounded-field btn-sm"></div>
			<div class="btn w-24 skeleton rounded-field btn-sm"></div>
			<div class="btn w-28 skeleton rounded-field btn-sm"></div>
		{:then categories}
			{#each categories as cat (cat.id)}
				<a class="btn btn-sm btn-success" href="/learning/courses?category={cat.id}">
					{cat.name}
				</a>
			{/each}
		{/await}
	</div>
</section>

<section class="mt-8 flex flex-col">
	<h2 class="text-header3">Tất cả khóa học</h2>
	<div
		class="mt-4 grid w-full grid-cols-4 items-stretch gap-2 gap-y-6 max-lg:grid-cols-3 max-md:grid-cols-2"
	>
		{#await data.queryResult}
			<LoadingPlaceholder text="Đang tải danh sách khóa học" />
		{:then result}
			{#if result.items.length}
				{#each result.items as course, index (course.id)}
					<CourseCard {course} {index} />
				{/each}
				<div class="col-span-full">
					<Pagination
						page={result.page}
						pageSize={result.pageSize}
						totalItems={result.totalItems}
						totalPages={result.totalPages}
					/>
				</div>
			{:else}
				<EmptyPlaceholder text="Không có khóa học nào" />
			{/if}
		{:catch err}
			<p class="text-error">Có lỗi xảy ra trong khi đang tải khóa học</p>
		{/await}
	</div>
</section>
