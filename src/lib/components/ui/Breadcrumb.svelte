<script lang="ts">
	import { page } from '$app/state';
	import { adminSidebarLayout } from '$lib/consts/sidebarLayout';
	import { toPascalCase } from '$lib/utils/converters';

	const breadcrumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);

		const crumbs = segments.map((seg, i) => ({
			title: toPascalCase(seg),
			href: '/' + segments.slice(0, i + 1).join('/')
		}));

		return crumbs;
	});
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each breadcrumbs as crumb, i}
			<li>
				{#if i < breadcrumbs.length - 1}
					<a href={crumb.href}>
						{#if adminSidebarLayout.find((item) => item.href === crumb.href)?.iconClass}
							<span
								class={adminSidebarLayout.find((item) => item.href === crumb.href)?.iconClass +
									'text-base'}
							></span>
						{/if}

						{crumb.title}
					</a>
				{:else}
					<span class="pointer-events-none font-bold hover:no-underline!">
						{#if adminSidebarLayout.find((item) => item.href === crumb.href)?.iconClass}
							<span
								class={adminSidebarLayout.find((item) => item.href === crumb.href)?.iconClass +
									'text-base'}
							></span>
						{/if}
						{crumb.title}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
