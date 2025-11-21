<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RedeemRewardSchema } from '$lib/schemas/redeemRewardSchema';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import SmallProfileSummary from '../(components)/SmallProfileSummary.svelte';
	import RewardStoreItem from './(components)/RewardStoreItem.svelte';

	const { data } = $props();
	const rewardStoreData = $derived(data.rewardStoreData);

	const { form, errors, message, enhance, submitting, delayed } = superForm<
		RedeemRewardSchema,
		{ toastData: ToastData }
	>(data.form);

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
		}
	});
</script>

<!-- Profile summary card -->
<div class="flex justify-between max-md:grid max-md:grid-cols-1">
	<div>
		<a href={resolve('/profile')} class="btn mt-2 btn-sm" aria-label="Quay lại">
			<span class="icon-[fa7-solid--arrow-left]"></span> Trở về trang cá nhân
		</a>
		<h1 class="text-header3 mt-2 font-bold">Cửa hàng phần thưởng</h1>
		<p class="text-base-content/60">
			Sử dụng xu của bạn để mở khóa các vật phẩm hỗ trợ học tập và phiếu mua sắm.
		</p>
	</div>
	{#await data.gamificationProfilePromise then gamificationProfile}
		{#if gamificationProfile}
			<SmallProfileSummary {gamificationProfile} />
		{:else}
			<p class="text-error-content">Không thể tải thông tin hồ sơ.</p>
		{/if}
	{/await}
</div>

<form action="?/redeemReward" method="POST" use:enhance>
	<div class="tabs-lift mt-2 tabs">
		<label class="tab font-bold text-info-content hover:text-info-content">
			<input type="radio" name="storeTabRadio" checked />
			<span class="mr-2 icon-[fa7-solid--flask-vial]"></span>
			Vật phẩm hỗ trợ
		</label>
		<div class="tab-content border-base-300 bg-base-100 p-4">
			{#if rewardStoreData?.boosters}
				<div class="grid grid-cols-4 gap-2 max-md:grid-cols-1">
					{#each rewardStoreData.boosters as booster}
						<RewardStoreItem item={booster} />
					{/each}
				</div>
			{/if}
		</div>

		<label class="tab font-bold text-success-content hover:text-success-content">
			<input type="radio" name="storeTabRadio" />
			<span class="mr-2 icon-[fa7-solid--ticket]"></span>
			Phiếu giảm giá
		</label>
		<div class="tab-content border-base-300 bg-base-100 p-4">
			{#if rewardStoreData?.vouchers}
				<div class="grid grid-cols-4 gap-2 max-md:grid-cols-1">
					{#each rewardStoreData.vouchers as voucher}
						<RewardStoreItem item={voucher} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</form>
