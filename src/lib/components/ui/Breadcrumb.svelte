<script lang="ts">
	import { page } from '$app/state';
	import {
		adminSidebarLayout,
		moderatorSidebarLayout,
		sellerSidebarLayout,
		type SidebarLayoutItem
	} from '$lib/consts/sidebarLayout';
	import { toPascalCase } from '$lib/utils/converters';

	// helper: flatten main + subItems into a single list for easier lookup
	function flattenSidebar(items: SidebarLayoutItem[]): SidebarLayoutItem[] {
		return items.flatMap((item) => [item, ...(item.subItems ? flattenSidebar(item.subItems) : [])]);
	}

	const allSidebarItems = flattenSidebar([
		...moderatorSidebarLayout,
		...sellerSidebarLayout,
		...adminSidebarLayout
	]);

	const breadcrumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);

		const crumbs = segments.map((seg, i) => ({
			title: toPascalCase(seg),
			href: '/' + segments.slice(0, i + 1).join('/')
		}));

		return crumbs;
	});

	function findSidebarItem(href: string) {
		return allSidebarItems.find((item: SidebarLayoutItem) => item.href === href);
	}

	function isIdOrUUID(str: string): boolean {
		const finalPart = str.split('/').pop() ?? '';

		// Check for UUID
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		// Check for numeric ID
		const numberRegex = /^\d+$/;

		return uuidRegex.test(finalPart) || numberRegex.test(finalPart);
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
						{#if isIdOrUUID(crumb.href)}
							<span class="icon-[mingcute--document-2-fill] text-base"></span>Chi tiết
						{:else}
							{#if findSidebarItem(crumb.href)?.iconClass}
								<span class={findSidebarItem(crumb.href)?.iconClass + ' text-base'}></span>
							{/if}
							{findSidebarItem(crumb.href)?.title ?? crumb.title}
						{/if}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
