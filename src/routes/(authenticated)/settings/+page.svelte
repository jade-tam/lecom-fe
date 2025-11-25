<script>
	import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';
	import { fly } from 'svelte/transition';
</script>

<section class="mt-2 rounded-box border bg-base-100 p-4" in:fly={{ x: -30 }}>
	<h1 class="mb-2 font-serif text-2xl">Cài đặt</h1>

	<div class="mt-4 flex justify-between">
		<div class="grow">
			<p class="">Thay đổi giao diện</p>
			<p class="mt-1 text-sm font-light text-base-content/75 mb-2">
				Tùy chỉnh màu sắc hiển thị trên toàn bộ ứng dụng
			</p>
			<ThemeSwitcher />
		</div>
	</div>
</section>
