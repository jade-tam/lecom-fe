<script lang="ts">
	import type { ToastData } from '$lib/utils/showToast';

	const { type = 'default', title, description }: ToastData = $props();

	const alertClass =
		{
			default: 'alert alert-default',
			info: 'alert alert-info',
			success: 'alert alert-success',
			warning: 'alert alert-warning',
			error: 'alert alert-error'
		}[type] ?? 'alert alert-default';
</script>

<div role="alert" class="{alertClass} min-w-xs border">
	{#if type === 'default'}
		<span class="icon-[mingcute--information-line] text-2xl"></span>
	{:else if type === 'info'}<span class="icon-[mingcute--information-line] text-2xl"></span>
	{:else if type === 'success'}<span class="icon-[mingcute--checks-line] text-2xl"></span>
	{:else if type === 'warning'}<span class="icon-[mingcute--warning-line] text-2xl"></span>
	{:else if type === 'error'}<span class="icon-[mingcute--close-circle-line] text-2xl"></span>{/if}
	<div class=" items-center">
		{#if title}
			<p class="mb-1 font-medium">{title}</p>
		{/if}
		{#if description}
			<p class="text-sm">{description}</p>
		{/if}
	</div>
</div>
