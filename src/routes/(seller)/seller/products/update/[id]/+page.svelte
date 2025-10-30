<script lang="ts">
	import SellerProductForm from '$lib/components/form/SellerProductForm.svelte';
	const { data } = $props();
</script>

<div class="my-2 flex flex-col justify-between overflow-x-auto">
	<div class="flex items-center gap-4">
		<a href="/seller/products" aria-label="return to category list" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Update Product</h1>
			<p class="text-base-content/60">Change existing information about your product.</p>
		</div>
	</div>

	<SellerProductForm dataForm={data.form} categories={data.categories} />
</div>
