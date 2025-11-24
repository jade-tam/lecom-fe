<script lang="ts">
	import { type Snippet } from 'svelte';
	import { gsap } from 'gsap';

	const {
		children,
		class: className = '',
		animateVars = {
			delay: 0,
			ease: 'power4.inOut',
			opacity: 0,
			duration: 0.3
		},
		// Anything you pass here will retrigger the animation:
		watch
	}: {
		children: Snippet;
		class?: string;
		animateVars?: gsap.TweenVars;
		watch?: string;
	} = $props();

	let containerRef: HTMLDivElement;
	let tween: gsap.core.Tween | null = null;

	// Re-run animation at start + every time "watch" changes
	$effect(() => {
		watch;
		if (!containerRef) return;

		// Kill old animation
		tween?.kill();

		// Run new animation
		tween = gsap.from(containerRef, {
			delay: 0,
			ease: 'power4.inOut',
			opacity: 0,
			duration: 0.3,
			...animateVars
		});

		return () => {
			tween?.kill();
		};
	});
</script>

<div bind:this={containerRef} class={className}>
	{@render children()}
</div>
