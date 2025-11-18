<script lang="ts">
	const {
		icon = 'icon-[fa7-solid--ghost]',
		text,
		description = '',
		class: className = 'h-84'
	} = $props();
</script>

<div
	class="col-span-full flex {className} w-full flex-col items-center justify-center text-secondary-content/60"
>
	<span class="{icon} text-2xl"></span>
	<p class="mt-2 text-sm font-bold italic">{text}</p>
	<p class="mt-2 text-xs italic">{description}</p>
</div>
