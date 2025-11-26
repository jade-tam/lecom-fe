<script>
	import DrawerSideContent from '$lib/components/layout/DrawerSideContent.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import { adminSidebarLayout } from '$lib/consts/sidebarLayout';

	let { children } = $props();
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="drawer xl:drawer-open">
	<input id="main-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col">
		<!-- Page content here -->
		<div class="flex items-center justify-between border-b-2 border-base-300 p-4">
			<div class="flex items-center gap-4">
				<label for="main-drawer" class="drawer-button btn btn-square btn-soft xl:hidden">
					<span class="icon-[mingcute--layout-leftbar-open-fill] text-2xl"></span>
				</label>
				<Breadcrumb />
			</div>
			<button class="btn btn-square btn-soft" aria-label="notification">
				<span class="icon-[fa7-solid--bell] text-2xl"></span>
			</button>
		</div>
		<div class="mx-auto h-full w-full max-w-7xl p-4 pt-0">
			{@render children()}
		</div>
	</div>
	<div class="drawer-side">
		<label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<DrawerSideContent sidebarLayoutItems={adminSidebarLayout} title="Trang quản trị hệ thống" />
	</div>
</div>
