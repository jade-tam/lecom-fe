<script lang="ts">
	const {
		tip = 'No information'
	}: {
		tip: string;
	} = $props();
</script>

<div class="tooltip flex items-center tooltip-info" data-tip={tip}>
	<span class="icon-[fa7-solid--question-circle] text-info"></span>
</div>
