<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { Placeholder } from '@tiptap/extensions';
	import { StarterKit } from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';

	let {
		content = $bindable(),
		editable = true
	}: {
		content: string;
		editable?: boolean;
	} = $props();

	let element: HTMLDivElement | null = $state(null);
	let editorState = $state<{ editor: Editor | null }>({ editor: null });

	onMount(() => {
		editorState.editor = new Editor({
			element: element,
			// register extensions
			extensions: [
				StarterKit,
				Placeholder.configure({
					// Use a placeholder:
					placeholder: 'Nhập nội dung bài viết…'
				})
			],
			// set the initial content
			content: content,
			// place the cursor in the editor after initialization
			autofocus: true,
			// make the text editable (default is true)
			editable: editable,
			onTransaction: ({ editor }) => {
				// Increment the state signal to force a re-render
				editorState = { editor };
				content = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div style="position: relative">
	{#if editorState.editor && editable}
		<!-- Toolbar -->
		<div class="flex w-fit flex-wrap items-center gap-2 rounded-field bg-base-200 p-2">
			<!-- Heading Group -->
			<div class="flex gap-2">
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Tiêu đề 1"
					onclick={() => editorState.editor!.chain().focus().toggleHeading({ level: 1 }).run()}
					aria-label="Tiêu đề 1"
				>
					<span class="icon-[mingcute--heading-1-line] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Tiêu đề 2"
					onclick={() => editorState.editor!.chain().focus().toggleHeading({ level: 2 }).run()}
					aria-label="Tiêu đề 2"
				>
					<span class="icon-[mingcute--heading-2-line] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Tiêu đề 3"
					onclick={() => editorState.editor!.chain().focus().toggleHeading({ level: 3 }).run()}
					aria-label="Tiêu đề 3"
				>
					<span class="icon-[mingcute--heading-3-line] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Đoạn văn"
					onclick={() => editorState.editor!.chain().focus().setParagraph().run()}
					aria-label="Đoạn văn"
				>
					<span class="icon-[mingcute--paragraph-line] text-xl"></span>
				</button>
			</div>

			<div class="divider mx-0 divider-horizontal py-2"></div>

			<!-- Style Group -->
			<div class="flex gap-2">
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="In đậm"
					onclick={() => editorState.editor!.chain().focus().toggleBold().run()}
					aria-label="In đậm"
				>
					<span class="icon-[mingcute--bold-fill] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="In nghiêng"
					onclick={() => editorState.editor!.chain().focus().toggleItalic().run()}
					aria-label="In nghiêng"
				>
					<span class="icon-[mingcute--italic-line] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Gạch dưới"
					onclick={() => editorState.editor!.chain().focus().toggleUnderline().run()}
					aria-label="Gạch dưới"
				>
					<span class="icon-[mingcute--underline-line] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Gạch ngang"
					onclick={() => editorState.editor!.chain().focus().toggleStrike().run()}
					aria-label="Gạch ngang"
				>
					<span class="icon-[mingcute--strikethrough-line] text-xl"></span>
				</button>
			</div>

			<div class="divider mx-0 divider-horizontal py-2"></div>

			<!-- List & Block Group -->
			<div class="flex gap-2">
				<!-- <button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Danh sách chấm"
					onclick={() => editorState.editor!.chain().focus().toggleBulletList().run()}
					aria-label="Danh sách chấm"
				>
					<span class="icon-[mingcute--list-bulleted-fill]"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Danh sách số"
					onclick={() => editorState.editor!.chain().focus().toggleOrderedList().run()}
					aria-label="Danh sách số"
				>
					<span class="icon-[mingcute--list-numbered-fill]"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Trích dẫn"
					onclick={() => editorState.editor!.chain().focus().toggleBlockquote().run()}
					aria-label="Trích dẫn"
				>
					<span class="icon-[mingcute--quote-left-fill]"></span>
				</button> -->
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Mã nguồn"
					onclick={() => editorState.editor!.chain().focus().toggleCodeBlock().run()}
					aria-label="Mã nguồn"
				>
					<span class="icon-[mingcute--code-fill]"></span>
				</button>
				<!-- <button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Đường kẻ ngang"
					onclick={() => editorState.editor!.chain().focus().setHorizontalRule().run()}
					aria-label="Đường kẻ ngang"
				>
					<span class="icon-[mingcute--horizontal-rule-fill]"></span>
				</button> -->
			</div>

			<div class="divider mx-0 divider-horizontal py-2"></div>

			<!-- Undo/Redo Group -->
			<div class="flex gap-2">
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Hoàn tác"
					onclick={() => editorState.editor!.chain().focus().undo().run()}
					aria-label="Hoàn tác"
				>
					<span class="icon-[mingcute--refresh-anticlockwise-1-line] text-xl"></span>
				</button>
				<button
					type="button"
					class="tooltip btn btn-square btn-ghost"
					data-tip="Làm lại"
					onclick={() => editorState.editor!.chain().focus().redo().run()}
					aria-label="Làm lại"
				>
					<span class="icon-[mingcute--refresh-1-line] text-xl"></span>
				</button>
			</div>
		</div>
	{/if}

	<div class="mt-2 rounded-field border bg-base-300 p-4" bind:this={element}></div>
</div>

<style>
	:global(.ProseMirror:focus) {
		outline: none !important;
		box-shadow: none !important;
	}

	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: var(--color-primary-content);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global(.ProseMirror h1) {
		font-size: 1.4rem;
	}
	:global(.ProseMirror h2) {
		font-size: 1.2rem;
	}
	:global(.ProseMirror h3) {
		font-size: 1.1rem;
	}
</style>
