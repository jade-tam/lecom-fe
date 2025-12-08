<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import {
		NOTIFICATIONS_CONTEXT,
		TOKEN_CONTEXT,
		USER_PROFILE_CONTEXT,
		USER_ROLE_CONTEXT
	} from '$lib/consts/contexts';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { setContext } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	injectSpeedInsights();

	let { children, data } = $props();

	setContext(USER_PROFILE_CONTEXT, () => data.userProfile);
	setContext(USER_ROLE_CONTEXT, () => data.userRole);
	setContext(NOTIFICATIONS_CONTEXT, () => data.notificationsPromise);
	setContext(TOKEN_CONTEXT, () => data.token);

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
