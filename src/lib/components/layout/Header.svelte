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

	<div class="shrink-0">
		<ul class="flex h-full items-center gap-2 px-6">
			<li>
				<a
					href="/learning"
					class="btn btn-ghost {page.url.pathname.startsWith('/learning') ? 'font-black' : ''}"
				>
					Học tập
				</a>
			</li>
			<li>
				<a
					href="/shopping"
					class="btn btn-ghost {page.url.pathname.startsWith('/shopping') ? 'font-black' : ''}"
				>
					Mua sắm
				</a>
			</li>
			<li>
				<a
					href="/community"
					class="btn btn-ghost {page.url.pathname.startsWith('/community') ? 'font-black' : ''}"
				>
					Cộng đồng
				</a>
			</li>
		</ul>
	</div>

	{#if page.url.pathname.startsWith('/learning')}
		<SearchInput
			placeholder="Tìm kiếm khóa học..."
			onEnter={(query) => goto(`/learning/courses?search=${query}`)}
		/>
	{:else if page.url.pathname.startsWith('/shopping')}
		<SearchInput
			placeholder="Tìm kiếm sản phẩm..."
			onEnter={(query) => goto(`/shopping/products?search=${query}`)}
		/>
	{:else}
		<div class="grow"></div>
	{/if}

	<div class="flex items-center gap-2 pl-8">
		{#if userProfile}
			<div class="tooltip tooltip-bottom" data-tip="Thông báo">
				<button class="btn btn-square btn-ghost" aria-label="Notification">
					<span class="icon-[fa7-solid--bell] text-xl"></span>
				</button>
			</div>
			<div class="tooltip tooltip-bottom" data-tip="Giỏ hàng">
				<a href="/cart" class="btn relative btn-square btn-ghost btn-secondary" aria-label="Cart">
					<span class="icon-[fa7-solid--shopping-cart] shrink-0 text-xl"></span>
					{#await cartCountPromise then cartCount}
						{#if cartCount}
							<span
								class="absolute top-0 right-0.5 badge h-4 w-4 rounded-full badge-xs badge-secondary"
							>
								{cartCount}
							</span>
						{/if}
					{/await}
				</a>
			</div>
			<div class="tooltip tooltip-bottom" data-tip="Trò chuyện & Tin nhắn">
				<a class="btn btn-square btn-ghost" aria-label="Chat" href="/chat">
					<span class="icon-[fa7-solid--message] text-xl"></span>
				</a>
			</div>
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
					<li><a href="/profile" class="rounded-field">Trang cá nhân</a></li>
					<li><a href="/orders" class="rounded-field">Lịch sử đơn hàng</a></li>
					<li><a href="/course-enrollments" class="rounded-field">Khóa học của tôi</a></li>
					<li><a href="/settings" class="rounded-field">Cài đặt</a></li>
					<li><a href="/help-and-feedback" class="rounded-field">Trợ giúp & Phản hồi</a></li>

					<div class="divider mx-2 my-0"></div>

					{#if userRole && haveAuthorization(userRole, 'Admin')}
						<li class="text-error-content">
							<a href="/admin" class="rounded-field">Trang quản trị hệ thống</a>
						</li>
					{/if}
					{#if userRole && haveAuthorization(userRole, 'Seller')}
						<li class="text-secondary-content">
							<a href="/seller" class="rounded-field">Trang quản lý cửa hàng</a>
						</li>
					{/if}
					{#if userRole && haveAuthorization(userRole, 'Moderator')}
						<li class="text-info-content">
							<a href="/moderator" class="rounded-field">Trang quản lý kiểm duyệt</a>
						</li>
					{/if}
					{#if userRole && !haveAuthorization(userRole, 'Seller')}
						<li>
							<a href="/seller-register" class="rounded-field">Đăng ký bán hàng</a>
						</li>
					{/if}

					<div class="divider mx-2 my-0"></div>

					<li><a href="/auth/logout" class="rounded-field text-error-content">Đăng xuất</a></li>
				</ul>
			</div>
		{:else}
			<a href="/auth/login" class="btn btn-primary">Đăng nhập</a>
			<a href="/auth/register" class="btn btn-secondary">Đăng ký</a>
		{/if}
	</div>
</header>
