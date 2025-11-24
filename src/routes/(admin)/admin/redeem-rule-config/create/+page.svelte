<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import AdminRedeemRuleForm from '$lib/components/form/AdminRedeemRuleForm.svelte';

	const { data } = $props();

	function handleBack() {
		goto(resolve('/admin/redeem-rule-config'));
	}
</script>

<div class="my-2 flex flex-col justify-between">
	<AnimatedDiv class="flex items-center gap-4" animateVars={{ translateX: -20 }}>
		<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
			<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
		</button>
		<h1 class="text-header3 font-bold">Tạo mục đổi thưởng mới</h1>
	</AnimatedDiv>

	<AnimatedDiv class="mt-1 mb-2 flex items-center gap-4" animateVars={{ translateX: -20 }}>
		<p class="text-base-content/60">
			Tạo mục đổi thưởng mới trên hệ thống để người dùng có thể sử dụng xu tích lũy.
		</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<AdminRedeemRuleForm dataForm={data.form} vouchersPromise={data.vouchersPromise} />
	</AnimatedDiv>
</div>
