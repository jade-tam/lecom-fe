<script lang="ts">
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { formatDate } from '$lib/utils/converters.js';

	const { data } = $props();
	const user = $derived(data.user);
</script>

<section class="flex min-h-screen flex-col items-center">
	<div class="my-2 flex w-full items-center gap-4">
		<a href="/admin/users-management" aria-label="return to category list" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">User details</h1>
			<p class="text-base-content/60">View all details about user.</p>
		</div>
	</div>

	<div class="w-full max-w-7xl space-y-4">
		<!-- HEADER SUMMARY -->
		<div class="grid grid-cols-3 gap-4 max-md:grid-cols-1">
			<!-- Avatar + Basic Info -->
			<div class="col-span-1 flex flex-col items-center gap-4 rounded-box border bg-base-100 p-6">
				<Image
					class="h-36 w-36 rounded-full object-cover"
					src={user.imageUrl ?? '/images/avatar-placeholder.png'}
					alt={user.fullName}
				/>

				<p class="text-header2 text-center font-serif">{user.fullName}</p>
				<p class="text-sm text-base-content/70">@{user.userName}</p>

				<div class="mt-3 w-full">
					<p class="text-sm"><strong>Email:</strong> {user.email}</p>
					<p class="text-sm"><strong>Phone:</strong> {user.phoneNumber ?? '—'}</p>
					<p class="text-sm"><strong>Date of birth:</strong> {formatDate(user.dateOfBirth)}</p>
					<p class="text-sm"><strong>Address:</strong> {user.address ?? '—'}</p>
				</div>

				<div class="badge badge-lg {user.isActive ? 'badge-success' : 'badge-error'} mt-2">
					{user.isActive ? 'Active' : 'Inactive'}
				</div>
			</div>

			<!-- Account Info -->
			<div class="col-span-2 rounded-box border bg-base-100 p-6">
				<p class="text-header3 mb-4">Account information</p>

				<div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
					<div>
						<p class="text-sm text-base-content/70">Email confirmed</p>
						<p class="font-medium">{user.emailConfirmed ? 'Yes' : 'No'}</p>
					</div>

					<div>
						<p class="text-sm text-base-content/70">Phone confirmed</p>
						<p class="font-medium">{user.phoneNumberConfirmed ? 'Yes' : 'No'}</p>
					</div>

					<div>
						<p class="text-sm text-base-content/70">Two-factor enabled</p>
						<p class="font-medium">{user.twoFactorEnabled ? 'Yes' : 'No'}</p>
					</div>

					<div>
						<p class="text-sm text-base-content/70">Failed login attempts</p>
						<p class="font-medium">{user.accessFailedCount}</p>
					</div>

					<div>
						<p class="text-sm text-base-content/70">Lockout enabled</p>
						<p class="font-medium">{user.lockoutEnabled ? 'Yes' : 'No'}</p>
					</div>

					<div>
						<p class="text-sm text-base-content/70">User ID</p>
						<code class="text-xs italic">{user.id}</code>
					</div>
				</div>
			</div>
		</div>

		<!-- CERTIFICATE + SHOP -->
		<div class="grid grid-cols-3 gap-4 max-md:grid-cols-1">
			<div class="col-span-1 rounded-box border bg-base-100 p-4">
				<p class="text-header3">Certificate</p>

				{#if user.certificateImageUrl}
					<div class="mt-3">
						<Image src={user.certificateImageUrl} alt="Certificate" class="w-full rounded-md" />
						<a
							href={user.certificateImageUrl}
							target="_blank"
							rel="noreferrer"
							class="mt-2 block text-sm text-primary"
						>
							Open full
						</a>
					</div>
				{:else}
					<EmptyPlaceholder text="No certificate" />
				{/if}

				<div class="divider my-4"></div>

				<p class="text-header3">Shop</p>

				{#if user.shop}
					<div class="mt-2">
						<p class="font-medium">{user.shop.name}</p>
						<p class="text-sm text-base-content/70">{user.shop.description}</p>
						<a href={`/shops/${user.shop.id}`} class="mt-2 inline-block text-sm text-primary"
							>View shop</a
						>
					</div>
				{:else}
					<EmptyPlaceholder text="No shop" />
				{/if}
			</div>

			<!-- ACTIVITY / LISTS -->
			<div class="col-span-2 space-y-6 rounded-box border bg-base-100 p-4">
				<div>
					<p class="text-header3">Activity summary</p>

					<div class="mt-4 grid grid-cols-3 gap-4 max-md:grid-cols-1">
						<div class="rounded-field border p-3">
							<p class="text-sm text-base-content/70">Posts</p>
							<p class="font-medium">{user.posts?.length}</p>
						</div>

						<div class="rounded-field border p-3">
							<p class="text-sm text-base-content/70">Comments</p>
							<p class="font-medium">{user.comments?.length}</p>
						</div>

						<div class="rounded-field border p-3">
							<p class="text-sm text-base-content/70">Reviews</p>
							<p class="font-medium">{user.reviews?.length}</p>
						</div>
					</div>
				</div>

				<div class="divider"></div>

				<div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
					<!-- Enrollments -->
					<div class="rounded-field border p-3">
						<p class="text-header4">Enrollments</p>

						{#if user.enrollments?.length}
							<ul class="mt-2 space-y-1 text-sm">
								{#each user.enrollments as e}
									<li class="truncate">{e}</li>
								{/each}
							</ul>
						{:else}
							<EmptyPlaceholder text="No enrollments" />
						{/if}
					</div>

					<!-- Addresses -->
					<div class="rounded-field border p-3">
						<p class="text-header4">Additional addresses</p>

						{#if user.addresses?.length}
							<ul class="mt-2 space-y-1 text-sm">
								{#each user.addresses as a}
									<li class="truncate">{a}</li>
								{/each}
							</ul>
						{:else}
							<EmptyPlaceholder text="No addresses" />
						{/if}
					</div>
				</div>

				<div class="divider"></div>

				<div class="grid grid-cols-3 gap-4 max-md:grid-cols-1">
					<div class="rounded-field border p-3">
						<p class="text-header4">Badges</p>
						<p class="font-medium">{user.userBadges?.length}</p>
					</div>

					<div class="rounded-field border p-3">
						<p class="text-header4">Vouchers</p>
						<p class="font-medium">{user.userVouchers?.length}</p>
					</div>

					<div class="rounded-field border p-3">
						<p class="text-header4">Notifications</p>
						<p class="font-medium">{user.notifications?.length}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- FULL RAW JSON VIEW -->

		<div class="mt-6 rounded-box border bg-base-100 p-4">
			<p class="text-header3 mb-2">Full User JSON</p>

			<div class="mockup-code w-full">
				<pre class="json-viewer overflow-auto rounded-box p-4 text-sm">
{JSON.stringify(user, null, 6)}
</pre>
			</div>
		</div>
	</div>
</section>

<style>
	code {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace;
		font-size: 0.85rem;
	}
</style>
