<script lang="ts">
	import { page } from '$app/state';
	import { toPascalCase } from '$lib/utils/converters';

	const breadcrumbs = $derived.by(() => {
		const segments = page.url.pathname.split('/').filter(Boolean);
		return segments.map((seg, i) => ({
			title: toPascalCase(seg),
			href: '/' + segments.slice(0, i + 1).join('/')
		}));
	});
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each breadcrumbs as crumb, i}
			<li>
				{#if i < breadcrumbs.length - 1}
					<a href={crumb.href}>{crumb.title}</a>
				{:else}
					<span>{crumb.title}</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
