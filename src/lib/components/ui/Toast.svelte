<script lang="ts">
	import type { ToastData } from '$lib/utils/showToast';

	const { type = 'default', title, description }: ToastData = $props();

	const alertClass = {
		default: 'alert alert-default',
		info: 'alert alert-info',
		success: 'alert alert-success',
		warning: 'alert alert-warning',
		error: 'alert alert-error'
	}[type] ?? 'alert alert-default';
</script>

<div role="alert" class="{alertClass} min-w-xs border">
	{#if type === 'default'}
		<span class="icon-[fa7-solid--info-circle] text-2xl"></span>
	{:else if type === 'info'}<span class="icon-[fa7-solid--info-circle] text-2xl"></span>
	{:else if type === 'success'}<span class="icon-[fa7-solid--check-circle] text-2xl"></span>
	{:else if type === 'warning'}<span class="icon-[fa7-solid--warning] text-2xl"></span>
	{:else if type === 'error'}<span class="icon-[fa7-solid--xmark-circle] text-2xl"></span>{/if}
	<div>
		{#if title}
			<p class="font-medium">{title}</p>
		{/if}
		{#if description}
			<p class="mt-1 text-sm">{description}</p>
		{/if}
	</div>
</div>
