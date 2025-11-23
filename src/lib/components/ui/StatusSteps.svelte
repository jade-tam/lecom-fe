<script lang="ts">
	import type { FormSelectOption } from './FormSelect.svelte';

	const { options, status, icons, getStepClass } = $props<{
		options: readonly FormSelectOption[];
		status: string;
		icons: Record<string, string>;
		getStepClass: (stepValue: any, currentStatus: any) => string;
	}>();
</script>

<ul class="steps mb-2">
	{#each options as step}
		<li class={`step ${getStepClass(step.value, status)}`}>
			<span class="step-icon">
				<span class={icons[step.value] ?? 'icon-[fa7-solid--circle-question]'}></span>
			</span>
			<span>{step.title}</span>
		</li>
	{/each}
</ul>
