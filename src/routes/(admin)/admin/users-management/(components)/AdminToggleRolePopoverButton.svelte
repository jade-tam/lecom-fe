<script lang="ts">
	import { enhance } from '$app/forms';
	import type { User } from '$lib/types/User';
	import { getUserRoleBtnClass } from '$lib/utils/classComposer';
	import { haveAuthorization } from '$lib/utils/others';

	const { user }: { user: User } = $props();

	let popover: HTMLDivElement | null = $state(null);
	let isSubmitting = $state(false);
	let popoverId = $derived(`toggle-role-popover-${user.id}`);
</script>

<div class="tooltip" data-tip="Cập nhật vai trò">
	<button
		type="button"
		class="btn btn-square btn-info"
		aria-label="Cập nhật vai trò"
		popovertarget={popoverId}
		style="anchor-name:--{popoverId}"
	>
		<span class="icon-[fa7-solid--user-shield] text-xl"></span>
	</button>
</div>

<div
	bind:this={popover}
	class="dropdown dropdown-end"
	popover
	id={popoverId}
	style="position-anchor:--{popoverId}"
>
	<div class="m-1 flex w-64 flex-col gap-2 rounded-field border bg-base-100 p-4 shadow">
		<p class="font-bold">Cập nhật vai trò cho</p>
		<p class="text-sm">
			<strong class="font-bold">{user.fullName}</strong>
			<span class="font-light">@{user.userName}</span>
		</p>
		<p class="text-xs text-base-content/60">
			Chỉnh sửa vai trò cho người dùng này bằng cách bật tắt nút phía dưới
		</p>
		<div class="flex gap-2">
			<form
				method="POST"
				action="?/toggleRole"
				use:enhance={() => {
					isSubmitting = true;

					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<button
					class={`btn ${haveAuthorization(user.roles, 'Moderator') ? '' : 'btn-dash'} btn-sm ${getUserRoleBtnClass('Moderator')}`}
					type="submit"
					aria-label="Moderator"
					disabled={isSubmitting}
				>
					Moderator
				</button>
				<input type="hidden" name="userId" value={user.id} />
				<input type="hidden" name="role" value="Moderator" />
				<input
					type="hidden"
					name="isAlreadyHaveRole"
					value={String(haveAuthorization(user.roles, 'Moderator'))}
				/>
			</form>
			<form
				method="POST"
				action="?/toggleRole"
				use:enhance={() => {
					isSubmitting = true;

					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<button
					class={`btn ${haveAuthorization(user.roles, 'Admin') ? '' : 'btn-dash'} btn-sm ${getUserRoleBtnClass('Admin')}`}
					type="submit"
					aria-label="Admin"
					disabled={isSubmitting}
				>
					Admin
				</button>
				<input type="hidden" name="userId" value={user.id} />
				<input type="hidden" name="role" value="Admin" />
				<input
					type="hidden"
					name="isAlreadyHaveRole"
					value={String(haveAuthorization(user.roles, 'Admin'))}
				/>
			</form>
		</div>
	</div>
</div>
