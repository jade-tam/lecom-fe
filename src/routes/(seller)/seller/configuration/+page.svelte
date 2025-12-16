<script>
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import ShopAddressForm from '$lib/components/form/ShopAddressForm.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { getShopAddress } from '$lib/remotes/shopAddress.remote';

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

{#await getShopAddress()}
	<LoadingPlaceholder text="Đang tải thông tin địa chỉ cửa hàng" />
{:then shopAddress}
	{#if !shopAddress}
		<div role="alert" class="alert alert-warning">
			<span class="icon-[mingcute--location-2-line] text-xl"> </span>
			<div class="flex flex-col gap-1">
				<span class="font-bold">Chưa thiết lập địa chỉ cửa hàng</span>

				<span
					>Vui lòng thiết lập địa chỉ cửa hàng để bên vận chuyển có thể tới lấy hàng và cửa hàng có
					thể bắt đầu hoạt động.</span
				>
			</div>
		</div>
	{/if}
{/await}

<AnimatedDiv animateVars={{ translateY: 16 }} class="mt-2 rounded-box border bg-base-100 p-4">
	{#await getShopAddress()}
		<LoadingPlaceholder text="Đang tải thông tin địa chỉ cửa hàng" />
	{:then shopAddress}
		<div class="flex flex-col gap-2">
			<div>
				<h2 class="text-header4 font-bold">Địa chỉ cửa hàng</h2>
				<p class="text-sm text-base-content/60">
					Cần thiết lập địa chỉ chính xác để bên giao hàng có thể tới lấy hàng.
				</p>
			</div>
			<ShopAddressForm mode={shopAddress ? 'update' : 'create'} dataForm={data.shopAddressForm} />
		</div>
	{/await}
</AnimatedDiv>
