<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		openButtonProps,
		ModalContent,
		ModalContentProps,
		children
	}: {
		openButtonProps: HTMLButtonAttributes;
		ModalContent: Component<any>;
		ModalContentProps?: Record<string, any>;
		children: Snippet;
	} = $props();

	let dialog: HTMLDialogElement | null = null;

	function handleOpen() {
		dialog?.showModal();
	}

	function handleClose() {
		dialog?.close();
	}
</script>

<button type="button" class="btn" onclick={() => handleOpen()} {...openButtonProps}>
	{@render children()}
</button>

<dialog class="modal duration-0" bind:this={dialog} onclick={() => handleClose()}>
	<div
		class="modal-box outline-0 max-md:p-4"
		role="dialog"
		tabindex="0"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		}}
	>
		<ModalContent onFormActionSuccess={() => handleClose()} {...ModalContentProps} />
	</div>
</dialog>
