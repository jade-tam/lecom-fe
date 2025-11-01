<script lang="ts">
	import { page } from '$app/state';
	import { USER_PROFILE_CONTEXT, USER_ROLE_CONTEXT } from '$lib/consts/contexts';
	import type { UserProfile } from '$lib/types/UserProfile';
	import { getContext } from 'svelte';
	import UserAvatar from '../ui/UserAvatar.svelte';
	import type { SidebarLayoutItem } from '$lib/consts/sidebarLayout';
	import type { UserRole } from '$lib/types/User';

	const {
		sidebarLayoutItems,
		title
	}: {
		sidebarLayoutItems: SidebarLayoutItem[];
		title: string;
	} = $props();

	const getUser = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);
	const getRole = getContext<() => UserRole>(USER_ROLE_CONTEXT);

	const userProfile = $derived(getUser());
	const role = $derived(getRole());

	let logoutModalRef: HTMLDialogElement;

	function openModal() {
		logoutModalRef.showModal();
	}
</script>

<div class="flex h-screen w-84 flex-col border bg-base-200 p-4">
	<a class="btn flex h-fit w-full flex-col items-center justify-center btn-ghost" href="/">
		<!-- <img class="size-6 md:size-7" src="/images/logo-transparent-512.png" alt="logo" /> -->
		<p class="ml-2 font-serif text-5xl font-black">Lecom</p>
		<p class="ml-2 text-lg font-black">{title}</p>
	</a>

	<div class="mt-6 flex grow flex-col gap-1">
		{#each sidebarLayoutItems as item (item.href)}
			{#if item.subItems}
				<div class="flex gap-4 px-4 py-2 text-sm font-semibold text-base-content/60">
					<span class={item.iconClass}></span><span>{item.title}</span>
				</div>
			{:else}
				<a
					href={item.href}
					class="btn justify-start gap-4 btn-ghost btn-primary"
					class:btn-active={page.url.pathname.startsWith(item.href)}
					><span class={item.iconClass}></span><span>{item.title}</span></a
				>
			{/if}
			<div class="flex">
				<div class="divider divider-horizontal"></div>
				<div class="flex grow flex-col gap-2">
					{#if item.subItems}
						{#each item.subItems as subItem (subItem.href)}
							<a
								href={subItem.href}
								class="btn justify-start gap-4 btn-ghost btn-primary"
								class:btn-active={page.url.pathname.startsWith(subItem.href)}
								><span class={subItem.iconClass}></span><span>{subItem.title}</span></a
							>
						{/each}
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<div class="flex items-center gap-2">
		<div class="tooltip grow" data-tip="Profile">
			<a
				class="btn flex min-w-0 flex-1 justify-start gap-2 px-2 btn-soft"
				class:btn-active={page.url.pathname.startsWith('/profile')}
				href="/profile"
			>
				<UserAvatar
					avatar_url={userProfile?.imageUrl ?? null}
					letter={userProfile?.userName[0].toUpperCase()}
					sizeClass={'w-7 h-7'}
				/>
				<div class="min-w-0 text-left">
					<p class="text-xs font-medium">{userProfile?.fullName ?? '---'}</p>
					<p class="truncate text-[0.65rem] font-light">{userProfile?.userName}</p>
				</div>
				<div
					class="ml-auto badge badge-xs {role === 'Admin'
						? 'badge-error'
						: role === 'Seller'
							? 'badge-info'
							: ''}"
				>
					{role}
				</div>
			</a>
		</div>

		<div class="tooltip" data-tip="Settings">
			<a
				class="btn btn-square btn-soft"
				aria-label="Settings"
				class:btn-active={page.url.pathname.startsWith('/settings')}
				href="/settings"
			>
				<span class="icon-[fa7-solid--gear] text-xl"></span>
			</a>
		</div>

		<div class="tooltip" data-tip="Logout">
			<button
				class="btn btn-square btn-soft"
				aria-label="Open logout modal"
				onclick={() => openModal()}
			>
				<span class="icon-[fa7-solid--sign-out-alt] text-xl"></span>
			</button>
		</div>
	</div>
</div>

<dialog bind:this={logoutModalRef} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Are you leaving?</h3>
		<p class="py-4">This action will log you out. You can always signing back in.</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Nope</button>
			</form>
			<a class="btn btn-error" href="/auth/logout">Logout</a>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
