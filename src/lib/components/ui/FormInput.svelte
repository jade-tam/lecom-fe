<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';

	let {
		name,
		label,
		type = 'text',
		icon = '',
		placeholder = '',
		form,
		errors
	} = $props<{
		name: string;
		label: string;
		type?: HTMLInputTypeAttribute;
		icon?: string;
		placeholder?: string;
		form: SuperFormData<any>;
		errors: SuperFormErrors<any>;
	}>();

	$inspect($errors);
</script>

<fieldset class="fieldset">
	<legend class="fieldset-legend">{label}</legend>
	<label class="input w-full">
		{#if icon}
			<span class={`icon-[${icon}] text-secondary`}></span>
		{/if}
		<input {type} {name} bind:value={$form[name]} {placeholder} />
	</label>
	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
