<script lang="ts">
	import { page } from '$app/state';
	import { USER_PROFILE_CONTEXT, USER_ROLE_CONTEXT } from '$lib/consts/contexts';
	import type { SidebarLayoutItem } from '$lib/consts/sidebarLayout';
	import type { UserRole } from '$lib/types/User';
	import type { UserProfile } from '$lib/types/UserProfile';
	import { getUserRoleBadgeClass } from '$lib/utils/classComposer';
	import { getContext } from 'svelte';
	import UserAvatar from '../ui/UserAvatar.svelte';

	const {
		sidebarLayoutItems,
		title
	}: {
		sidebarLayoutItems: SidebarLayoutItem[];
		title: string;
	} = $props();

	const getUser = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);
	const getRoles = getContext<() => UserRole | UserRole[]>(USER_ROLE_CONTEXT);

	const userProfile = $derived(getUser());
	const roles = $derived(getRoles());

	let logoutModalRef: HTMLDialogElement;

	function openModal() {
		logoutModalRef.showModal();
	}
</script>

<div class="flex h-screen w-84 flex-col border bg-base-200 p-2">
	<a
		class="btn flex h-fit w-full flex-col items-start justify-start gap-0 px-0 btn-ghost {page.url.pathname.startsWith(
			'/seller'
		)
			? 'text-secondary-content'
			: page.url.pathname.startsWith('/admin')
				? 'text-error-content'
				: page.url.pathname.startsWith('/moderator')
					? 'text-info-content'
					: 'text-primary-content'}"
		href="/"
	>
		<!-- <img class="size-6 md:size-7" src="/images/logo-transparent-512.png" alt="logo" /> -->
		<p class="ml-2 font-serif text-5xl font-black">Lecom</p>
		<p class="ml-2 font-black">{title}</p>
	</a>

	<div class="mt-6 flex grow flex-col gap-1">
		{#each sidebarLayoutItems as item (item.href)}
			{#if item.subItems}
				<div class="flex gap-2 px-4 py-2 text-sm font-semibold text-secondary-content italic">
					<span>{item.title}</span>
					<span class={item.iconClass}></span>
				</div>
			{:else}
				<a
					href={item.href}
					class="btn justify-start gap-4 text-primary-content btn-ghost btn-primary"
					class:btn-active={page.url.pathname.startsWith(item.href)}
					><span class={item.iconClass}></span><span>{item.title}</span></a
				>
			{/if}
			<div class="flex">
				<div class="divider divider-horizontal"></div>
				<div class="flex grow flex-col gap-1">
					{#if item.subItems}
						{#each item.subItems as subItem (subItem.href)}
							<a
								href={subItem.href}
								class="btn mb-1 justify-start gap-4 text-primary-content btn-ghost btn-primary"
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
		<div class="tooltip grow" data-tip="Hồ sơ">
			<a
				class="btn flex min-w-0 flex-1 justify-start gap-2 px-2 btn-soft btn-lg"
				class:btn-active={page.url.pathname.startsWith('/profile')}
				href="/profile"
			>
				<UserAvatar
					avatar_url={userProfile?.imageUrl ?? null}
					letter={userProfile?.userName[0].toUpperCase()}
					sizeClass={'w-8 h-8'}
				/>
				<div class="flex flex-col gap-0.5 text-left">
					<div class="flex items-center gap-2">
						<p class="text-xs font-medium">{userProfile?.fullName ?? '---'}</p>
						<p class="truncate text-[0.65rem] font-light">{userProfile?.userName}</p>
					</div>
					<div class="flex gap-1">
						{#if Array.isArray(roles)}
							{#each roles as role}
								{#if role !== 'Customer'}
									<div class="badge badge-xs {getUserRoleBadgeClass(role)}">
										{role}
									</div>
								{/if}
							{/each}
						{:else if roles}
							<div class="badge badge-xs {getUserRoleBadgeClass(roles)}">
								{roles}
							</div>
						{/if}
					</div>
				</div>
			</a>
		</div>

		<div class="tooltip" data-tip="Cài đặt">
			<a
				class="btn btn-square btn-soft btn-lg"
				aria-label="Cài đặt"
				class:btn-active={page.url.pathname.startsWith('/settings')}
				href="/settings"
			>
				<span class="icon-[fa7-solid--gear] text-xl"></span>
			</a>
		</div>

		<div class="tooltip" data-tip="Đăng xuất">
			<button
				class="btn btn-square btn-soft btn-lg"
				aria-label="Mở hộp thoại đăng xuất"
				onclick={() => openModal()}
			>
				<span class="icon-[fa7-solid--sign-out-alt] text-xl"></span>
			</button>
		</div>
	</div>
</div>

<dialog bind:this={logoutModalRef} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Bạn muốn đăng xuất?</h3>
		<p class="py-4">
			Thao tác này sẽ đăng xuất bạn khỏi hệ thống. Bạn có thể đăng nhập lại bất cứ lúc nào.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Không</button>
			</form>
			<a class="btn btn-error" href="/auth/logout">Đăng xuất</a>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>Đóng</button>
	</form>
</dialog>
