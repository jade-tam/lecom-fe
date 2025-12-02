<script lang="ts">
	import SellerCourseForm from '$lib/components/form/SellerCourseForm.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex flex-col justify-between overflow-x-auto">
	<div class="flex items-center gap-4">
		<a href="/seller/courses" aria-label="Quay lại danh sách khóa học" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Tạo khóa học mới</h1>
			<p class="text-base-content/60">
				Xây dựng khóa học micro-learning và liên kết với sản phẩm của shop.
			</p>
		</div>
	</div>

	<SellerCourseForm dataForm={data.form} categories={data.categories} mode="create" />
</div>
