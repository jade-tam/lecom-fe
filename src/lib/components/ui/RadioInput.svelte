<script lang="ts">
	export type RadioInputOption = {
		label: string;
		value: string;
	};

	type PropsType = {
		value: string | null;
		options: RadioInputOption[];
	};

	let { value = $bindable(null), options }: PropsType = $props();
</script>

{#each options as option (option.value)}
	<div class="flex items-center gap-2">
		<input type="radio" class="peer radio" value={option.value} bind:group={value} />
		<p class="peer-checked:font-black">{option.label}</p>
	</div>
{/each}
