<script lang="ts">
	const { children } = $props();
</script>

<div class="relative">
	{@render children()}

	<a href="/" class="btn absolute top-2 right-2 btn-ghost btn-sm btn-secondary">
		<span class="icon-[fa7-solid--arrow-left]"></span>
		Return
	</a>
</div>
