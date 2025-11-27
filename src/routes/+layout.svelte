<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { USER_PROFILE_CONTEXT, USER_ROLE_CONTEXT } from '$lib/consts/contexts';
	import { setContext } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();

	let { children, data } = $props();

	setContext(USER_PROFILE_CONTEXT, () => data.userProfile);
	setContext(USER_ROLE_CONTEXT, () => data.userRole);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster visibleToasts={6} position="top-center" />
{@render children?.()}
