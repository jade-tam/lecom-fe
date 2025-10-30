<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Image from '$lib/components/ui/Image.svelte';
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

<div class="my-2 flex items-center justify-between">
	<div class="flex gap-3">
		<a href="/admin/shops-management/" aria-label="return to shop list" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<h2>Shop Details</h2>
	</div>

	<div class="flex gap-2">
		<div class="flex items-center">
			{#if shop.status === 'Pending'}
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
							<fieldset class="fieldset">
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
<!-- ============================================================================================= -->

<div class="rounded-box border bg-base-100 p-4">
	<div class="flex gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Shop Avatar</legend>
			<Image src={shop.shopAvatar} class="h-32 w-32" alt={shop.name + ' shop'} />
		</fieldset>
		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend">Shop Banner</legend>
			<Image src={shop.shopBanner} alt={shop.name + ' shop'} class="h-32 w-full" />
		</fieldset>
	</div>

	<div class="mt-2 flex flex-col gap-1 overflow-hidden">
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

	<div class="overflow-auto">
		<div class="stats mt-4 border">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<span class="icon-[fa7-solid--box-archive] text-2xl"></span>
				</div>
				<div class="stat-title">Total Products</div>
				<div class="stat-value">4</div>
				<div class="stat-desc">In {shop.categoryName}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<span class="icon-[fa7-solid--money-bill-trend-up] text-2xl"> </span>
				</div>
				<div class="stat-title">Total sells</div>
				<div class="stat-value">0</div>
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
	</div>

	<fieldset class="mt-2 fieldset">
		<legend class="fieldset-legend">Shop Phone Number</legend>
		<label class="input w-full">
			<span class={`icon-[fa7-solid--phone-square] text-secondary`}></span>
			<input value={shop.phoneNumber} readonly />
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Shop Address</legend>
		<label class="input w-full">
			<span class={`icon-[fa7-solid--location-dot] text-secondary`}></span>
			<input value={shop.address} readonly />
		</label>
	</fieldset>

	<div class="grid grid-cols-2 gap-4">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Business Type</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--briefcase] text-secondary`}></span>
				<input value={shop.businessType} readonly />
			</label>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Main Category</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--swatchbook] text-secondary`}></span>
				<input value={shop.categoryName} readonly />
			</label>
		</fieldset>
	</div>
</div>

<!-- ============================================================================================= -->

<div class="mt-2 rounded-box border bg-base-100 p-4">
	<div class="flex flex-col gap-1">
		<h3>Owner Information</h3>

		<div class="grid grid-cols-2 gap-4">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Owner Full Name</legend>
				<label class="input w-full">
					<span class={`icon-[fa7-solid--circle-user] text-secondary`}></span>
					<input value={shop.ownerFullName} readonly />
				</label>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Owner Date Of Birth</legend>
				<label class="input w-full">
					<span class={`icon-[fa7-solid--calendar-alt] text-secondary`}></span>
					<input value={formatDate(shop.ownerDateOfBirth)} readonly />
				</label>
			</fieldset>
		</div>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Personal ID Number</legend>
			<label class="input w-full">
				<span class={`icon-[fa7-solid--id-card] text-secondary`}></span>
				<input value={shop.ownerPersonalIdNumber} readonly />
			</label>
		</fieldset>

		<div class="flex w-full gap-4">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">ID Card Front Image</legend>
				<Image src={shop.ownerPersonalIdFrontUrl} alt="ID Card Front" class="h-32 w-64" />
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">ID Card Back Image</legend>
				<Image src={shop.ownerPersonalIdBackUrl} alt="ID Card Front" class="h-32 w-64" />
			</fieldset>
		</div>
	</div>
</div>

<!-- ============================================================================================= -->

<div class="mt-2 overflow-auto rounded-box border bg-base-100 p-4">
	<h3>Business Document</h3>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Document</legend>
		<a class="link" href={shop.ownershipDocumentUrl} target="_blank"
			>{shop.ownershipDocumentUrl?.split('/').pop() ?? 'Document'}</a
		>
	</fieldset>
</div>
