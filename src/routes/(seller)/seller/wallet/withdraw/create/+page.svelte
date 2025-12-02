<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import WithdrawForm from '$lib/components/form/WithdrawForm.svelte';

	const { data } = $props();

	function handleBack() {
		history.back();
	}
</script>

<div class="my-2 flex justify-between">
	<AnimatedDiv animateVars={{ translateX: -20 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
				<span class="icon-[fa7-solid--arrow-left]"></span>Trở về
			</button>
			<h1 class="text-header3 font-bold">Tạo yêu cầu rút tiền mới</h1>
		</div>
		<p class="text-base-content/60">
			Tạo yêu cầu rút tiền từ ví cửa hàng về tài khoản ngân hàng của bạn.
		</p>
	</AnimatedDiv>
</div>

<AnimatedDiv class="max-w-xl mx-auto" animateVars={{ translateY: 20 }}>
	<WithdrawForm dataForm={data.form} />
</AnimatedDiv>
