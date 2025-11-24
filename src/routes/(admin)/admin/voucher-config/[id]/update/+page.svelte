<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import AdminVoucherForm from '$lib/components/form/AdminVoucherForm.svelte';

	const { data } = $props();

	function handleBack() {
		goto(resolve('/admin/voucher-config'));
	}
</script>

<div class="my-2 flex flex-col justify-between">
	<AnimatedDiv class="flex items-center gap-4" animateVars={{ translateX: -20 }}>
		<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
			<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
		</button>
		<h1 class="text-header3 font-bold">Cập nhật phiếu giảm giá</h1>
	</AnimatedDiv>

	<AnimatedDiv class="mt-1 mb-2 flex items-center gap-4" animateVars={{ translateX: -20 }}>
		<p class="text-base-content/60">Chỉnh sửa các thông tin liên quan tới phiếu giảm giá.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<AdminVoucherForm dataForm={data.form} isEdit />
	</AnimatedDiv>
</div>
