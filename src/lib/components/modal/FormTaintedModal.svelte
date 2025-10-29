<script lang="ts">
	let {
		modal = $bindable(),
		leaveHref
	}: {
		modal: HTMLDialogElement | null;
		leaveHref: string;
	} = $props();
</script>

<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Do you want to leave?</h3>
		<p class="py-4">Changes you made may not be saved.</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Nope</button>
			</form>
			<a class="btn btn-error" href={leaveHref}>Leave</a>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
