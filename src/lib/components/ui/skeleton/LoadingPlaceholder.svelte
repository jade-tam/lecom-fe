<script lang="ts">
	const { text, description = '', class: className = 'h-84' } = $props();
</script>

<div
	class="col-span-full flex {className} w-full flex-col items-center justify-center text-secondary-content/60"
>
	<span class="loading loading-xl loading-infinity"></span>
	<p class="mt-2 animate-pulse text-sm font-bold italic">{text}</p>
	<p class="mt-2 animate-pulse text-xs italic">{description}</p>
</div>
