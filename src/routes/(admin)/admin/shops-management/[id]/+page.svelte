<script>
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
	import { getStatusBadgeClass } from '$lib/utils/classComposer';
	import { formatDate, getTimeSince } from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast.js';

	const { data, form } = $props();
	const { shop } = $derived(data);

	$inspect(form);

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);

			if (form.toastData.type === 'success') {
				invalidateAll();
			}
		}
	});
</script>

<div class="my-2 flex justify-between">
	<div class="flex gap-3">
		<a href="/admin/shops-management/" aria-label="return to shop list" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<h2>Shop Details</h2>
	</div>

	<div class="flex gap-2">
		<div class="flex items-center">
			{#if true}
				<form method="POST" action="?/approve" use:enhance>
					<input type="hidden" name="id" value={shop.id} />
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn m-1 btn-success">
							<span class="icon-[fa7-solid--check-circle]"></span> Approve
						</div>
						<div
							tabindex="-1"
							class="dropdown-content flex w-52 flex-col gap-2 rounded-field border bg-base-100 p-4"
						>
							<p class="font-bold">Approve this shop?</p>
							<button class="btn btn-success">
								<span class="icon-[fa7-solid--check-circle]"></span>Confirm Approve</button
							>
						</div>
					</div>
				</form>
				<form method="POST" action="?/reject" use:enhance>
					<input type="hidden" name="id" value={shop.id} />
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn m-1 btn-error">
							<span class="icon-[fa7-solid--circle-xmark]"></span>Reject
						</div>
						<div
							tabindex="-1"
							class="dropdown-content flex w-96 flex-col gap-2 rounded-field border bg-base-100 p-4"
						>
							<p class="font-bold">Reject this shop?</p>
							<fieldset class={`fieldset`}>
								<legend class="fieldset-legend">Reason</legend>
								<label class="input w-full">
									<input name="reason" placeholder="Enter reason here..." />
								</label>
							</fieldset>
							<button class="btn btn-error">
								<span class="icon-[fa7-solid--circle-xmark]"></span>Confirm Reject</button
							>
						</div>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

<div class="overflow-auto rounded-box border bg-base-100 p-4">
	<div class="flex gap-4">
		<div class="avatar">
			<div class="h-32 w-32 rounded-selector border">
				<img src={shop.ownerPersonalIdBackUrl} alt={shop.name + ' shop'} />
			</div>
		</div>
		<div class="flex flex-col gap-1 overflow-hidden">
			<h3 class="text-header2">{shop.name}</h3>
			<p class="font-bold text-secondary italic">{shop.categoryName}</p>
			<div class="mt-1 flex items-center gap-2">
				<div class={`badge ${getStatusBadgeClass(shop.status)}`}>
					{shop.status}
				</div>
				{#if shop.status === 'Approved'}
					<p class="text-xs italic">Since {formatDate(shop.approvedAt)}</p>
				{:else if shop.status === 'Rejected'}
					<p class="text-xs italic">Reason: {shop.rejectedReason}</p>
				{/if}
			</div>
			<p class="mt-2">{shop.description}</p>
		</div>
	</div>

	<div class="stats mt-4 shadow">
		<div class="stat">
			<div class="stat-figure text-secondary">
				<span class="icon-[fa7-solid--box-archive] text-2xl"></span>
			</div>
			<div class="stat-title">Total Products</div>
			<div class="stat-value">127</div>
			<div class="stat-desc">In {shop.categoryName}</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary">
				<span class="icon-[fa7-solid--money-bill-trend-up] text-2xl"> </span>
			</div>
			<div class="stat-title">Total sells</div>
			<div class="stat-value">4,200</div>
			<div class="stat-desc">489 last month ↗︎ 400 (22%)</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary">
				<span class="icon-[fa7-solid--business-time] text-2xl"></span>
			</div>
			<div class="stat-title">In Operation For</div>
			{#if shop.status === 'Approved'}
				<div class="stat-value">{getTimeSince(shop.approvedAt)}</div>
				<div class="stat-desc">Since {formatDate(shop.approvedAt)}</div>
			{:else}
				<div class="stat-value">---</div>
				<div class="stat-desc">Waiting for approve...</div>
			{/if}
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary">
				<span class="icon-[fa7-solid--star] text-2xl"></span>
			</div>
			<div class="stat-title">Shop Reviews</div>
			<div class="stat-value">4,3</div>
			<div class="stat-desc">145 reviews</div>
		</div>
	</div>

	<div class="mt-4 flex gap-2">
		<p>Shop Phone Number:</p>
		<p class="font-bold">{shop.phoneNumber}</p>
	</div>
	<div class="flex gap-2">
		<p>Address:</p>
		<p class="font-bold">{shop.address}</p>
	</div>
	<div class="flex gap-2">
		<p>Business Type:</p>
		<p class="font-bold">{shop.businessType}</p>
	</div>

	<div class="divider my-2"></div>

	<div class="flex flex-col gap-1">
		<h3>Owner Details</h3>

		<UserAvatar
			avatar_url={shop.ownerPersonalIdBackUrl}
			sizeClass="w-32 h-32 rounded-full"
			letter={shop.ownerFullName.charAt(0)}
		/>

		<div class="mt-2 flex gap-2">
			<p>Full Name:</p>
			<p class="font-bold">{shop.ownerFullName}</p>
		</div>
		<div class="flex gap-2">
			<p>Date Of Birth:</p>
			<p class="font-bold">{formatDate(shop.ownerDateOfBirth)}</p>
		</div>
		<div class="flex gap-2">
			<p>Personal ID Number:</p>
			<p class="font-bold">{shop.ownerPersonalIdNumber}</p>
		</div>
		<div class="flex gap-2">
			<p>Personal ID Images:</p>
		</div>
		<div class="flex gap-2">
			<div class="avatar">
				<div class="h-32 w-64 rounded-selector border">
					<img src={shop.ownerPersonalIdFrontUrl} alt={shop.name + ' shop'} />
				</div>
			</div>
			<div class="avatar">
				<div class="h-32 w-64 rounded-selector border">
					<img src={shop.ownerPersonalIdBackUrl} alt={shop.name + ' shop'} />
				</div>
			</div>
		</div>
	</div>
</div>
