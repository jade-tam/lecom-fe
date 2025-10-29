<script lang="ts">
	import { page } from '$app/state';
	import { adminSidebarLayout, type AdminSidebarLayoutItem } from '$lib/consts/sidebarLayout';
	import { toPascalCase } from '$lib/utils/converters';

	// helper: flatten main + subItems into a single list for easier lookup
	function flattenSidebar(items: AdminSidebarLayoutItem[]): AdminSidebarLayoutItem[] {
		return items.flatMap((item) => [item, ...(item.subItems ? flattenSidebar(item.subItems) : [])]);
	}

	const allSidebarItems = flattenSidebar(adminSidebarLayout);

	const breadcrumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);

		const crumbs = segments.map((seg, i) => ({
			title: toPascalCase(seg),
			href: '/' + segments.slice(0, i + 1).join('/')
		}));

		return crumbs;
	});

	function findSidebarItem(href: string) {
		return allSidebarItems.find((item: AdminSidebarLayoutItem) => item.href === href);
	}
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each breadcrumbs as crumb, i}
			<li>
				{#if i < breadcrumbs.length - 1}
					<a href={crumb.href}>
						{#if findSidebarItem(crumb.href)?.iconClass}
							<span class={findSidebarItem(crumb.href)?.iconClass + ' text-base'}></span>
						{/if}
						{findSidebarItem(crumb.href)?.title ?? crumb.title}
					</a>
				{:else}
					<span class="pointer-events-none font-bold hover:no-underline!">
						{#if findSidebarItem(crumb.href)?.iconClass}
							<span class={findSidebarItem(crumb.href)?.iconClass + ' text-base'}></span>
						{/if}
						{findSidebarItem(crumb.href)?.title ?? crumb.title}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
