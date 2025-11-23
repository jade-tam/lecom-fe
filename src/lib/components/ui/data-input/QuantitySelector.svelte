<script lang="ts">
	import NumberFlow from '@number-flow/svelte';

	let { value = $bindable(1) } = $props<{ value?: number }>();

	function increase() {
		value += 1;
	}

	function decrease() {
		if (value > 1) value -= 1;
	}
</script>

<div class="flex gap-3">
	<button
		type="button"
		class="btn btn-square btn-secondary"
		onclick={decrease}
		disabled={value <= 1}>-</button
	>
	<span class="w-6 text-center font-serif text-xl font-black"><NumberFlow {value} /></span>
	<button type="button" class="btn btn-square btn-secondary" onclick={increase}>+</button>
</div>
