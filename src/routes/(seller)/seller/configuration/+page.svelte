<script>
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import ShopAddressForm from '$lib/components/form/ShopAddressForm.svelte';
	import ShopConnectGHNForm from '$lib/components/form/ShopConnectGHNForm.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { getGHNStatus, getShopAddress } from '$lib/remotes/shopAddress.remote';

	const { data } = $props();
</script>

<div class="my-2 flex flex-wrap items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<!-- <button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button> -->
			<h1 class="text-header3 font-bold">Cài đặt cửa hàng</h1>
		</div>
		<p class="text-base-content/60">
			Cập nhật địa chỉ và thiết lập liên kết với hệ thống giao hàng.
		</p>
	</AnimatedDiv>

	<!-- <AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">...</AnimatedDiv> -->
</div>

{#await getGHNStatus()}
	<LoadingPlaceholder text="Đang tải thông tin liên kết GHN" />
{:then status}
	{#if status}
		{#if !status.isConnected}
			<AnimatedDiv
				animateVars={{ translateX: 20, duration: 0.6 }}
				class="alert animate-pulse alert-warning"
			>
				<span class="icon-[mingcute--truck-line] text-xl"> </span>
				<div class="flex flex-col gap-1">
					<span class="font-bold">Chưa kết nối với đơn vị vận chuyển Giao Hàng Nhanh</span>

					<span>{status?.message}</span>
				</div>
			</AnimatedDiv>
		{:else}
			<AnimatedDiv animateVars={{ translateX: 20, duration: 0.6 }} class="alert alert-success">
				<span class="icon-[mingcute--truck-line] text-xl"> </span>
				<div class="flex flex-col gap-1">
					<span class="font-bold">Đã kết nối với đơn vị vận chuyển Giao Hàng Nhanh</span>

					<span>{status?.message}</span>
				</div>
			</AnimatedDiv>
		{/if}
	{/if}
{/await}

<AnimatedDiv animateVars={{ translateY: 16 }} class="mt-2 mb-2 rounded-box border bg-base-100 p-4">
	<div class="flex flex-col gap-2">
		<div>
			<h2 class="text-header4 font-bold">Kết nối với hệ thống vận chuyển Giao Hàng Nhanh</h2>
			<p class="text-sm text-base-content/60">
				Thiết lập kết nối với đơn vị vận chuyển Giao Hàng Nhanh.
				<a
					href="https://api.ghn.vn/home/docs/detail"
					target="_blank"
					rel="noopener noreferrer"
					class="link link-primary">(Xem hướng dẫn lấy API Token)</a
				>
			</p>
		</div>
		<ShopConnectGHNForm dataForm={data.shopConnectGHNForm} />
	</div>
</AnimatedDiv>

{#await getShopAddress()}
	<LoadingPlaceholder text="Đang tải thông tin địa chỉ cửa hàng" />
{:then shopAddress}
	{#if !shopAddress}
		<AnimatedDiv
			animateVars={{ translateX: 20, delay: 0.1, duration: 0.6 }}
			class="alert animate-pulse alert-warning"
		>
			<span class="icon-[mingcute--location-2-line] text-xl"> </span>
			<div class="flex flex-col gap-1">
				<span class="font-bold">Chưa thiết lập địa chỉ kho hàng</span>

				<span
					>Vui lòng thiết lập địa chỉ kho hàng để hoàn tất quá trình đăng ký cửa hàng và bắt đầu bán
					hàng.</span
				>
			</div>
		</AnimatedDiv>
	{/if}
{/await}

<AnimatedDiv
	animateVars={{ translateY: 16, delay: 0.1 }}
	class="mt-2 rounded-box border bg-base-100 p-4"
>
	{#await getShopAddress()}
		<LoadingPlaceholder text="Đang tải thông tin địa chỉ cửa hàng" />
	{:then shopAddress}
		<div class="flex flex-col gap-2">
			<div>
				<h2 class="text-header4 font-bold">Địa chỉ kho hàng</h2>
				<p class="text-sm text-base-content/60">
					Thiết lập địa chỉ kho và thông tin liên hệ của kho cho cửa hàng.
				</p>
			</div>
			<ShopAddressForm mode={shopAddress ? 'update' : 'create'} dataForm={data.shopAddressForm} />
		</div>
	{/await}
</AnimatedDiv>
