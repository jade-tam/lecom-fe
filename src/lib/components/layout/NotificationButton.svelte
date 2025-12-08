<script lang="ts">
	import { enhance } from '$app/forms';
	import { getNotificationsPromise, getToken } from '$lib/context/appContext';
	import { formatDateTime } from '$lib/utils/converters';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { SignalRNotificationHub } from '$lib/utils/signalRNotificationHub';
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import EmptyPlaceholder from '../ui/EmptyPlaceholder.svelte';

	const notificationsPromise = getNotificationsPromise();
	let popover: HTMLDivElement | null = $state(null);
	const popoverId = `notification-popover`;

	const token = getToken();
	let notifications: any[] = $state([]);
	let unreadCount = $state(0);
	let signalRHub: SignalRNotificationHub | null = null;

	onMount(async () => {
		notifications = await notificationsPromise;
		unreadCount = notifications.filter((n) => !n.isRead).length;

		if (!token) return;

		signalRHub = new SignalRNotificationHub(token);
		await signalRHub.connect();

		signalRHub.onReceiveNotification((notification) => {
			notifications = [notification, ...notifications];
			unreadCount = notifications.filter((n) => !n.isRead).length;
		});

		signalRHub.onUnreadCount((count: number) => {
			unreadCount = count;
		});
	});

	onDestroy(() => {
		if (signalRHub) {
			signalRHub.disconnect();
		}
	});
</script>

<div class="tooltip tooltip-bottom" data-tip="Thông báo">
	<button
		class="btn relative btn-square text-primary-content btn-ghost btn-primary"
		aria-label="Notification"
		popovertarget={popoverId}
		style="anchor-name:--{popoverId}"
	>
		<span class="icon-[mingcute--bell-ringing-fill] text-2xl"></span>
		{#if unreadCount > 0}
			<span
				class="absolute top-0 right-0.5 badge h-4 w-4 animate-ping rounded-full badge-xs badge-error"
			>
			</span>
			<span class="absolute top-0 right-0.5 badge h-4 w-4 rounded-full badge-xs badge-error">
				{unreadCount}
			</span>
		{/if}
	</button>
</div>

<div
	bind:this={popover}
	class="dropdown dropdown-end"
	popover
	id={popoverId}
	style="position-anchor:--{popoverId}"
>
	<div
		class="m-1 flex max-h-[70vh] w-92 flex-col gap-2 overflow-y-auto rounded-field border bg-base-100 p-2 shadow"
	>
		<div class="flex justify-between gap-4">
			<p class="font-serif font-bold">Thông báo</p>
			<form
				action="/?/readAllNotifications"
				method="POST"
				use:enhance={({ formData }) => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							console.log(result);

							// Mark all notifications as read and set unreadCount to 0
							notifications = notifications.map((n) => ({ ...n, isRead: true }));
							unreadCount = 0;
							if (result.data) showToast(result.data.toastData as ToastData);
						}
					};
				}}
			>
				<button class="btn mt-2 btn-xs btn-success" disabled={unreadCount === 0}>
					<span class="icon-[mingcute--checks-fill]"></span>Đánh dấu tất cả đã đọc
				</button>
			</form>
		</div>
		{#if notifications.length === 0}
			<EmptyPlaceholder text="Bạn chưa có thông báo mới" />
		{:else}
			{#each notifications as notification (notification.id)}
				<div
					animate:flip={{ duration: 200 }}
					class="flex flex-col gap-1 rounded-field border p-3 duration-300
					{notification.isRead ? 'border-base-200 bg-base-200' : 'border-primary bg-primary/30'}"
				>
					<div class="flex items-center gap-2">
						<span class="badge badge-sm badge-primary">{notification.type}</span>
						<span class="ml-auto text-xs text-base-content/70">
							{formatDateTime(notification.createdAt)}
						</span>
					</div>
					<div class="mt-1 text-sm font-semibold text-base-content">{notification.title}</div>
					<div class="mt-1 text-xs text-base-content/70">{notification.content}</div>
					<!-- {#if notification.content}
						<a href={notification.content} class="mt-1 link text-xs link-primary">Xem chi tiết</a>
					{/if} -->
					<form
						action="/?/readNotificationById"
						method="POST"
						use:enhance={({ formData }) => {
							formData.set('id', notification.id);

							return async ({ result, update }) => {
								if (result.type === 'success') {
									console.log(result);

									// Update notifications array to trigger Svelte reactivity
									notifications = notifications.map((n) =>
										n.id === notification.id ? { ...n, isRead: true } : n
									);
									unreadCount = notifications.filter((n) => !n.isRead).length;
									if (result.data) showToast(result.data.toastData as ToastData);
								}
							};
						}}
					>
						{#if !notification.isRead}
							<button
								transition:slide={{ duration: 200 }}
								class="btn mt-2 btn-xs btn-success"
								disabled={notification.isRead}
							>
								<span class="icon-[mingcute--check-fill]"></span>Đánh dấu đã đọc
							</button>
						{/if}
					</form>
				</div>
			{/each}
		{/if}
	</div>
</div>
