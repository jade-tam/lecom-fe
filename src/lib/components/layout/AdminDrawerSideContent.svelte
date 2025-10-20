<script lang="ts">
	import { page } from '$app/state';
	import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
	import type { UserProfile } from '$lib/types/UserProfile';
	import { getContext } from 'svelte';
	import UserAvatar from '../ui/UserAvatar.svelte';
	import { adminSidebarLayout } from '$lib/consts/sidebarLayout';

	const user = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);

	let logoutModalRef: HTMLDialogElement;

	function openModal() {
		logoutModalRef.showModal();
	}
</script>

<div class="flex h-screen w-84 flex-col border bg-base-200 p-4">
	<div class="flex h-fit w-full flex-col items-center justify-center">
		<!-- <img class="size-6 md:size-7" src="/images/logo-transparent-512.png" alt="logo" /> -->
		<p class="ml-2 font-serif text-5xl font-black">Lecom</p>
		<p class="ml-2 text-lg font-black">Admin Dashboard</p>
	</div>

	<div class="mt-6 flex grow flex-col gap-2">
		{#each adminSidebarLayout as item}
			<a
				href={item.href}
				class="btn justify-start gap-4 btn-ghost btn-primary"
				class:btn-active={page.url.pathname.startsWith(item.href)}
				><span class={item.iconClass}></span><span>{item.title}</span></a
			>
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
					avatar_url={user()?.imageUrl ?? null}
					letter={user()?.userName[0].toUpperCase()}
					sizeClass={'w-7 h-7'}
				/>
				<div class="min-w-0 text-left">
					<p class="text-xs font-medium">{user()?.fullName}</p>
					<p class="truncate text-[0.65rem] font-light">{user()?.userName}</p>
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
