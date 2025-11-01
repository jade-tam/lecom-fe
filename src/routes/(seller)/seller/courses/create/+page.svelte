<script lang="ts">
	import SellerCourseForm from '$lib/components/form/SellerCourseForm.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex flex-col justify-between overflow-x-auto">
	<div class="flex items-center gap-4">
		<a href="/seller/courses" aria-label="return to category list" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Create New Course</h1>
			<p class="text-base-content/60">
				Build your micro-learning course and link it with your shop products.
			</p>
		</div>
	</div>

	<SellerCourseForm dataForm={data.form} categories={data.categories} mode="create" />
</div>
