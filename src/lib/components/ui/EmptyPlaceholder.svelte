<script lang="ts">
	import AnimatedDiv from '../animate/AnimatedDiv.svelte';

	const {
		icon = 'icon-[fa7-solid--ghost]',
		text,
		description = '',
		class: className = 'h-64'
	} = $props();
</script>

<AnimatedDiv
	animateVars={{ translateY: 10, duration: 0.8 }}
	class="col-span-full flex {className} text-primray-content/50 w-full flex-col items-center justify-center"
>
	<span class="{icon} text-2xl"></span>
	<p class="mt-2 text-sm font-bold italic">{text}</p>
	<p class="mt-2 text-xs italic">{description}</p>
</AnimatedDiv>
