<script lang="ts">
	import SellerProductForm from '$lib/components/form/SellerProductForm.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex flex-col justify-between overflow-x-auto">
	<div class="flex items-center gap-4">
		<a href="/seller/products" aria-label="Quay lại danh sách sản phẩm" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Thêm sản phẩm mới</h1>
			<p class="text-base-content/60">Thêm sản phẩm mới vào cửa hàng của bạn.</p>
		</div>
	</div>

	<SellerProductForm dataForm={data.form} categories={data.categories} />
</div>
