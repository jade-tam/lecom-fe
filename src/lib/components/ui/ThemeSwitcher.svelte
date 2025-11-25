<script lang="ts">
	import { themes } from '$lib/config/themeConfig';
	import { onMount } from 'svelte';

	let theme = $state('');

	onMount(() => {
		theme = localStorage.getItem('theme') ?? themes[0];
		document.documentElement.setAttribute('data-theme', theme);
	});

	function setTheme(newTheme: string) {
		theme = newTheme;
		localStorage.setItem('theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<fieldset class="fieldset grid w-full grid-cols-8 gap-4">
	{#each themes.map((theme) => ({ value: theme, label: theme })) as option}
		<label class="flex cursor-pointer items-center gap-2">
			<input
				type="radio"
				name="theme-radios"
				class="theme-controller radio"
				value={option.value}
				checked={theme === option.value}
				onchange={() => setTheme(option.value)}
			/>
			{option.label}
		</label>
	{/each}
</fieldset>
