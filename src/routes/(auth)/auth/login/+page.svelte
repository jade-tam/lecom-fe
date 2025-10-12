<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import { loginSchema, type LoginSchema } from '$lib/schemas/loginSchema.js';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<LoginSchema, ToastData>(
		data.form,
		{
			validators: zod4Client(loginSchema),
			onUpdated: ({ form }) => {
				if (form.message?.type === 'success') {
					goto('/learn');
				}
			}
		}
	);

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
			<h1 class="mb-4 font-serif text-5xl">Welcome back!</h1>
			<h1 class="mb-6 text-right font-serif text-xl">Sign in to continue your journey.</h1>

			<FormInput
				name="username"
				label="Username"
				placeholder="Enter your cool username..."
				type="text"
				{form}
				{errors}
			/>

			<FormInput
				name="password"
				label="Password"
				placeholder="Your super secret password..."
				type="password"
				{form}
				{errors}
			/>

			<button class="btn mt-10 w-full btn-primary" disabled={$submitting}
				>Login
				{#if $delayed}
					<span class="loading loading-md loading-dots"></span>
				{/if}
			</button>

			<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/register"
				>New user? Let's Register a new account.</a
			>
		</form>
	</div>
</main>
