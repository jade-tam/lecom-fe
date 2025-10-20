<script>
	import CategoryTable from './(components)/CategoryTable.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex justify-between">
	<h2>Categories Management</h2>

	<div>
		<a href="./categories-management/add" class="btn btn-primary">
			<span class="mr-2 icon-[fa7-solid--add]"></span>Add new category
		</a>
	</div>
</div>

<CategoryTable categories={data.categories} />
