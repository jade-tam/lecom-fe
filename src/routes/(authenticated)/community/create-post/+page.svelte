<script>
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import CommunityPostForm from '$lib/components/form/CommunityPostForm.svelte';

	const { data } = $props();

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
			<h1 class="text-header3 font-bold">Tạo bài viết cộng đồng</h1>
		</div>
		<p class="text-base-content/60">
			Chia sẻ ý kiến, thảo luận và đóng góp nội dung trong cộng đồng.
		</p>
	</AnimatedDiv>
</div>

<div class="rounded-box border bg-base-100 p-4">
	<CommunityPostForm dataForm={data.form}  />
</div>
