<script lang="ts">
	import { page } from '$app/state';
	import type { UserProfile } from '$lib/types/UserProfile';

	import { getContext, onMount } from 'svelte';
	import UserAvatar from '../ui/UserAvatar.svelte';
	import type { UserRole } from '$lib/types/User';
	import { USER_PROFILE_CONTEXT, USER_ROLE_CONTEXT } from '$lib/consts/contexts';

	let searchInput: HTMLInputElement | null = null;
	const getUserProfile = getContext<() => UserProfile | null>(USER_PROFILE_CONTEXT);
	const getUserRole = getContext<() => UserRole | null>(USER_ROLE_CONTEXT);
	let userProfile = $derived(getUserProfile());
	let userRole = $derived(getUserRole());

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

	<div class="flex items-center gap-2 pl-8">
		{#if userProfile}
			<button class="btn btn-square btn-ghost" aria-label="Notification">
				<span class="icon-[fa7-solid--bell] text-xl"></span>
			</button>
			<a href="/cart" class="btn btn-square btn-ghost" aria-label="Cart">
				<span class="icon-[fa7-solid--shopping-cart] text-xl"></span>
			</a>
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn m-1 btn-square btn-link">
					<UserAvatar
						avatar_url={userProfile.imageUrl}
						letter={userProfile.userName.charAt(0).toUpperCase()}
					/>
				</div>
				<ul
					tabindex="0"
					class="dropdown-content menu z-1 w-52 rounded-field bg-base-100 p-2 shadow-sm"
				>
					{#if userRole === 'Admin'}
						<li><a href="/admin" class="rounded-field">Admin Dashboard</a></li>
					{/if}
					{#if userRole === 'Seller'}
						<li><a href="/seller" class="rounded-field">Seller Dashboard</a></li>
					{/if}
					<li><a href="/profile" class="rounded-field">Profile</a></li>
					<li><a href="/settings" class="rounded-field">Settings</a></li>
					{#if userRole === 'Customer'}
						<li><a href="/seller-register" class="rounded-field">Register Shop</a></li>
					{/if}
					<li><a href="/help-and-feedback" class="rounded-field">Help & Feedback</a></li>
					<li><a href="/auth/logout" class="rounded-field text-error">Logout</a></li>
				</ul>
			</div>
		{:else}
			<a href="/auth/login" class="btn btn-primary">Login</a>
			<a href="/auth/register" class="btn btn-secondary">Register</a>
		{/if}
	</div>
</header>
