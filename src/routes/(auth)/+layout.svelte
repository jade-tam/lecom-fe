<script lang="ts">
	const { children } = $props();
</script>

<div class="relative">
	{@render children()}

	<a href="/" class="btn absolute top-2 right-2 text-secondary-content btn-ghost btn-secondary">
		<span class="icon-[fa7-solid--arrow-left]"></span>
		Trở về trang chủ
	</a>
</div>
