<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import ToolTip from './ToolTip.svelte';
	import DateSelector from './data-input/DateSelector.svelte';
	import { fly } from 'svelte/transition';

	let {
		label,
		icon = '',
		help = '',
		superForm,
		errors,
		name,
		postfix,
		hidden = false,
		class: className = '',
		hideError = false,
		withDateSelector = false,
		...restInputAttr
	}: HTMLInputAttributes & {
		label?: string;
		icon?: string;
		help?: string;
		name: string;
		hidden?: boolean;
		class?: string;
		postfix?: string;
		superForm: SuperFormData<any>;
		errors: SuperFormErrors<Record<string, string>>;
		hideError?: boolean;
		withDateSelector?: boolean;
	} = $props();
</script>

<fieldset in:fly={{ y: 12, duration: 500 }} class={`fieldset ${className}`}>
	{#if label}
		<legend class="fieldset-legend" class:hidden
			>{label}
			{#if help}
				<ToolTip tip={help} />
			{/if}
		</legend>
	{/if}
	<label class="input w-full" class:hidden>
		{#if icon}
			<span class={`shrink-0 text-xl ${icon}`}></span>
		{/if}
		<input {name} bind:value={$superForm[name]} {...restInputAttr} />
		{#if postfix}
			<span class="ml-2 font-black text-primary-content italic">{postfix}</span>
		{/if}
		{#if withDateSelector}
			<DateSelector
				openButtonProps={{ class: 'btn btn-xs btn-secondary' }}
				popoverId="{name}-date-input"
				bind:date={$superForm[name]}
			>
				<span class="icon-[mingcute--calendar-2-line]"></span>Lựa chọn ngày
			</DateSelector>
		{/if}
	</label>
	{#if $errors[name] && !hideError}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
