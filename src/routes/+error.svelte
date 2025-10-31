<script>
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-base-200 p-8 text-center">
	<h1 class="mb-4">
		{page.status} -
		{page.status === 404 ? 'Page Not Found' : 'Something went wrong'}
	</h1>

	<p class="mb-8 text-gray-600">
		{page.status === 404
			? "The page you're looking for doesn’t exist or has been moved."
			: (page.error?.message ?? 'An unexpected error occurred.')}
	</p>

	<div>
		<img
			class="max-w-80 object-contain"
			src={page.status === 404 ? '/icons/page-not-found.svg' : '/icons/server-error.svg'}
			alt="error"
		/>
	</div>

	<a href="/" class="btn btn-primary mt-12"> Go Home </a>
</div>
