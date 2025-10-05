<script lang="ts">
	import { page } from '$app/state';

	import { onMount } from 'svelte';

	let searchInput: HTMLInputElement | null = null;

	onMount(() => {
		const handleShortcut = (e: KeyboardEvent) => {
			// Detect Ctrl+K or Cmd+K
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				searchInput?.focus();
			}
		};

		window.addEventListener('keydown', handleShortcut);
		return () => window.removeEventListener('keydown', handleShortcut);
	});
</script>

<header class="flex items-center">
	<a href="/">
		<h1 class="text-3xl font-black uppercase">Lecom</h1>
	</a>

	<div>
		<ul class="flex h-full items-center px-6">
			<li>
				<a href="/learn" class="p-6" class:font-black={page.url.pathname.startsWith('/learn')}>
					Learn
				</a>
			</li>
			<li>
				<a href="/shop" class="p-6" class:font-black={page.url.pathname.startsWith('/shop')}>
					Shop
				</a>
			</li>
			<li>
				<a
					href="/community"
					class="p-6"
					class:font-black={page.url.pathname.startsWith('/community')}
				>
					Community
				</a>
			</li>
		</ul>
	</div>

	<label class="input w-full">
		<span class="icon-[fa7-solid--search]"></span>
		<input bind:this={searchInput} type="search" class="grow" placeholder="Search for ?..." />
		<kbd class="kbd kbd-sm">Ctrl</kbd>
		<kbd class="kbd kbd-sm">K</kbd>
	</label>

	<div class="flex gap-2 pl-8">
		<a href="/auth/login" class="btn btn-primary">Login</a>
		<a href="/auth/register" class="btn btn-secondary">Register</a>
	</div>
</header>
