<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import showToast from '$lib/utils/showToast';
	import WithdrawalsTable from './(components)/WithdrawalsTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});

	function handleBack() {
		history.back();
	}
</script>

<div class="my-2 flex flex-wrap justify-between gap-2">
	<AnimatedDiv animateVars={{ translateX: -20 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
				<span class="icon-[fa7-solid--arrow-left]"></span>Trở về
			</button>
			<h1 class="text-header3 font-bold">Danh sách yêu cầu rút tiền</h1>
		</div>
		<p class="text-base-content/60">
			Danh sách yêu cầu rút tiền từ ví cửa hàng về tài khoản ngân hàng của bạn.
		</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<a href={resolve('/seller/wallet/withdraw/create')} class="btn btn-primary">
			<span class="icon-[mingcute--add-circle-line] text-xl"></span>Tạo yêu cầu mới</a
		>
	</AnimatedDiv>
</div>

<WithdrawalsTable withdrawalsPromise={data.myWithdrawalsPromise} />
