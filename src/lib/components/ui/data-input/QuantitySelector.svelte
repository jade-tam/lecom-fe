<script lang="ts">
	let { value = $bindable(1) } = $props<{ value?: number }>();

	function increase() {
		value += 1;
	}

	function decrease() {
		if (value > 1) value -= 1;
	}
</script>

<div>
	<button type="button" class="btn btn-secondary" onclick={decrease} disabled={value <= 1}>-</button
	>
	<span class="w-4 p-4 font-serif text-xl font-black">{value}</span>
	<button type="button" class="btn btn-secondary" onclick={increase}>+</button>
</div>
