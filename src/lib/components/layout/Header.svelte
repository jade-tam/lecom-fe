<script lang="ts">
	import { page } from '$app/state';
	import type { UserProfile } from '$lib/types/UserProfile';

	import { USER_PROFILE_CONTEXT, USER_ROLE_CONTEXT } from '$lib/consts/contexts';
	import type { UserRole } from '$lib/types/User';
	import { getContext } from 'svelte';
	import SearchInput from '../ui/SearchInput.svelte';
	import UserAvatar from '../ui/UserAvatar.svelte';
	import { goto } from '$app/navigation';
	import { haveAuthorization } from '$lib/utils/others';

	const {
		cartCountPromise
	}: {
		cartCountPromise: Promise<number>;
	} = $props();

	const getUserProfile = getContext<() => UserProfile | null>(USER_PROFILE_CONTEXT);
	const getUserRole = getContext<() => UserRole | null>(USER_ROLE_CONTEXT);
	let userProfile = $derived(getUserProfile());
	let userRole = $derived(getUserRole());
</script>

<header class="flex items-center">
	<a href="/">
		<h1 class="text-3xl font-black uppercase">Lecom</h1>
	</a>

	<div>
		<ul class="flex h-full items-center gap-2 px-6">
			<li>
				<a
					href="/learning"
					class="btn btn-ghost {page.url.pathname.startsWith('/learning') ? 'font-black' : ''}"
				>
					Learning
				</a>
			</li>
			<li>
				<a
					href="/shopping"
					class="btn btn-ghost {page.url.pathname.startsWith('/shopping') ? 'font-black' : ''}"
				>
					Shopping
				</a>
			</li>
			<li>
				<a
					href="/community"
					class="btn btn-ghost {page.url.pathname.startsWith('/community') ? 'font-black' : ''}"
				>
					Community
				</a>
			</li>
		</ul>
	</div>

	{#if page.url.pathname.startsWith('/learning')}
		<SearchInput
			placeholder="Search for courses..."
			onEnter={(query) => goto(`/learning/courses?search=${query}`)}
		/>
	{:else if page.url.pathname.startsWith('/shopping')}
		<SearchInput
			placeholder="Search for products..."
			onEnter={(query) => goto(`/shopping/products?search=${query}`)}
		/>
	{:else}
		<div class="grow"></div>
	{/if}

	<div class="flex items-center gap-2 pl-8">
		{#if userProfile}
			<button class="btn btn-square btn-ghost" aria-label="Notification">
				<span class="icon-[fa7-solid--bell] text-xl"></span>
			</button>
			<a href="/cart" class="btn relative btn-square btn-ghost btn-secondary" aria-label="Cart">
				<span class="icon-[fa7-solid--shopping-cart] shrink-0 text-xl"></span>
				{#await cartCountPromise then cartCount}
					{#if cartCount}
						<span class="absolute top-0 right-0.5 badge h-4 w-4 rounded-full badge-xs badge-secondary">
							{cartCount}
						</span>
					{/if}
				{/await}
			</a>
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn m-1 btn-square btn-link">
					<UserAvatar
						avatar_url={userProfile.imageUrl}
						letter={userProfile.userName.charAt(0).toUpperCase()}
					/>
				</div>
				<ul
					tabindex="-1"
					class="dropdown-content menu z-1 w-52 rounded-field bg-base-100 p-2 shadow-sm"
				>
					{#if userRole && haveAuthorization(userRole, 'Admin')}
						<li><a href="/admin" class="rounded-field">Admin Dashboard</a></li>
					{/if}
					{#if userRole && haveAuthorization(userRole, 'Seller')}
						<li><a href="/seller" class="rounded-field">Seller Dashboard</a></li>
					{/if}
					<li><a href="/profile" class="rounded-field">Profile</a></li>
					<li><a href="/settings" class="rounded-field">Settings</a></li>
					{#if userRole && haveAuthorization(userRole, 'Customer')}
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
