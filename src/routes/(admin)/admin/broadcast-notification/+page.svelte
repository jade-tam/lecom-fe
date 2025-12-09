<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import AdminBroadcastForm from '$lib/components/form/AdminBroadcastForm.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex flex-col justify-between">
	<AnimatedDiv class="flex items-center gap-4" animateVars={{ translateX: -20 }}>
		<h1 class="text-header3 font-bold">Gửi thông báo</h1>
	</AnimatedDiv>

	<AnimatedDiv class="mt-1 mb-2 flex items-center gap-4" animateVars={{ translateX: -20 }}>
		<p class="text-base-content/60">
			Tạo và gửi thông báo người dùng trên hệ thống.
		</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateY: 20 }}>
		<AdminBroadcastForm dataForm={data.form} />
	</AnimatedDiv>
</div>
