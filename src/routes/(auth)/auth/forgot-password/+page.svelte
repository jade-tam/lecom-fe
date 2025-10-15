<script lang="ts">
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import {
		forgotPasswordSchema,
		type ForgotPasswordSchema
	} from '$lib/schemas/forgotPasswordSchema.js';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<
		ForgotPasswordSchema,
		ToastData
	>(data.form, {
		validators: zod4Client(forgotPasswordSchema)
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<main class="w-screen bg-base-200">
	<div class="mx-auto flex min-h-screen max-w-md items-center p-2">
		<!-- HERE IS THE FORM -->
		<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 md:p-8" use:enhance>
			<h1 class="mb-8 text-center font-serif text-3xl">Recover your password</h1>

			<FormInput
				name="email"
				label="What is your email?"
				placeholder="Email of your account..."
				type="text"
				icon="icon-[fa7-solid--envelope]"
				help="We will send you a verification to this email"
				superForm={form}
				{errors}
			/>

			<button class="btn mt-2 w-full btn-primary" disabled={$submitting}
				>Send verification email
				{#if $delayed}
					<span class="loading loading-md loading-dots"></span>
				{/if}
			</button>

			<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/register"
				>Suddenly remember your password?<strong>Back to login</strong>.</a
			>
		</form>
	</div>
</main>
