<script lang="ts">
	const { icon = 'icon-[fa7-solid--ghost]', text } = $props();
</script>

<div
	class="col-span-full flex h-84 w-full flex-col items-center justify-center text-secondary-content/60"
>
	<span class="{icon} text-2xl"></span>
	<p class="mt-2 text-sm italic">{text}</p>
</div>
