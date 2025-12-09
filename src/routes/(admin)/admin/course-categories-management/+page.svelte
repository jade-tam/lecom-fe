<script>
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import CategoryTable from './(components)/CategoryTable.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Quản lý danh mục khóa học</h1>
		</div>
		<p class="text-base-content/60">Quản lý danh mục khóa học trên nền tảng của bạn.</p>
	</AnimatedDiv>
	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-1">
		<a href="./course-categories-management/add" class="btn btn-primary">
			<span class="mr-2 icon-[fa7-solid--plus]"></span>Thêm danh mục
		</a>
	</AnimatedDiv>
</div>

<CategoryTable categories={data.categories} />
