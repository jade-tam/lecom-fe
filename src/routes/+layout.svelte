<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
	import { setContext } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	let { children, data } = $props();

	setContext(USER_PROFILE_CONTEXT, () => data.userProfile);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster visibleToasts={6} position="top-center" />
{@render children?.()}
