<script>
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';

	const { data } = $props();

	const badgeColors = ['badge-info', 'badge-success', 'badge-secondary', 'badge-primary'];
</script>

<section>
	<div class="my-48 grid grid-cols-2 items-center gap-8 max-md:my-12 max-md:grid-cols-1">
		<div>
			<h1>Learn freely. Shop smartly.</h1>
			<p class="mt-2">
				Explore 100% free online courses to grow your skills — and discover products that make
				learning easier, fun, and more effective.
			</p>
		</div>

		<div class="flex justify-end max-md:justify-center">
			<div class="max-w-[400px]">
				<img src="/icons/learning.svg" alt="lecom hero" />
			</div>
		</div>
	</div>
</section>

<!-- ========================================================================================== -->

<section class="mt-64 flex flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Free Courses for Everyone</h2>
	<div class="my-16 grid grid-cols-2 items-center gap-8 max-md:mb-8 max-md:grid-cols-1">
		<div class="flex justify-center max-md:justify-center">
			<div class="max-w-[300px]">
				<img src="/icons/learning-tutorial.svg" alt="lecom hero" />
			</div>
		</div>
		<div>
			<h3 class="text-header2">Learn something new — completely free</h3>
			<p class="mt-2">
				Dive into hands-on courses built by experts and enthusiasts. Whether you're into technology,
				creativity, or personal growth, our free courses help you learn practical skills that
				matter.
			</p>

			<h3 class="mt-8">Top Learning Categories</h3>
			<div class="mt-2 flex flex-wrap gap-2">
				{#await data.courseCategories}
					{#each Array(4) as skeleton}
						<div class="h-4 w-16 skeleton"></div>
					{/each}
				{:then courseCategories}
					{#each courseCategories?.slice(0, 4) as category, i (category.id)}
						<div class={`badge badge-lg ${badgeColors[i % badgeColors.length]}`}>
							<span class="icon-[fa7-solid--bookmark]"></span>
							{category.name}
						</div>
					{/each}
				{:catch err}
					<p class="text-error">Error loading top categories</p>
				{/await}
			</div>
		</div>
	</div>

	<h3 class="self-start">Popular Courses</h3>
	<div class="grid w-full grid-cols-4 items-stretch gap-4 py-2 max-md:grid-cols-2">
		{#await data.popularCourses}
			{#each Array(4) as skeleton}
				<div class="h-64 w-full skeleton"></div>
			{/each}
		{:then popularCourses}
			{#each popularCourses?.slice(0, 4) as course (course.id)}
				<CourseCard {course} />
			{/each}
		{:catch err}
			<p class="text-error">Error loading popular courses</p>
		{/await}
	</div>

	<a href="/learn" class="btn mt-8 btn-primary">
		Explore all courses <span class="icon-[fa7-solid--arrow-right]"></span>
	</a>
</section>

<!-- ========================================================================================== -->

<section class="mt-64 flex flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Products That Help You Learn</h2>
	<div class="my-16 grid grid-cols-2 items-center gap-8 max-md:mb-8 max-md:grid-cols-1">
		<div>
			<h3 class="text-header2">Shop the tools that support your learning.</h3>
			<p class="mt-2">
				From notebooks and study kits to gadgets and creative tools — find products carefully
				selected to help you stay inspired, focused, and productive while learning.
			</p>

			<h3 class="mt-8">Top Product Categories</h3>
			<div class="mt-2 flex flex-wrap gap-2">
				{#await data.productCategories}
					{#each Array(4) as skeleton}
						<div class="h-4 w-16 skeleton"></div>
					{/each}
				{:then productCategories}
					{#each productCategories?.slice(0, 4) as category, i (category.id)}
						<div class={`badge badge-lg ${badgeColors[i % badgeColors.length]}`}>
							<span class="icon-[fa7-solid--box-open]"></span>
							{category.name}
						</div>
					{/each}
				{:catch err}
					<p class="text-error">Error loading product categories</p>
				{/await}
			</div>
		</div>
		<div class="flex justify-center max-md:justify-center">
			<div class="max-w-[300px]">
				<img src="/icons/shopping.svg" alt="lecom hero" />
			</div>
		</div>
	</div>

	<h3 class="self-start">Best Seller Products</h3>
	<div class="grid w-full grid-cols-4 items-stretch gap-4 py-2 max-md:grid-cols-2">
		{#await data.bestSellerProducts}
			{#each Array(4) as skeleton}
				<div class="h-64 w-full skeleton"></div>
			{/each}
		{:then bestSellerProducts}
			{#each bestSellerProducts?.slice(0, 4) as product (product.id)}
				<ProductCard {product} />
			{/each}
		{:catch err}
			<p class="text-error">Error loading best seller products</p>
		{/await}
	</div>

	<a href="/shop" class="btn mt-8 btn-primary">
		Start Shopping Now <span class="icon-[fa7-solid--arrow-right]"></span>
	</a>
</section>

<!-- ========================================================================================== -->

<section class="mt-64 mb-32 flex flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Teach and Sell with LECOM</h2>
	<div class="my-16 grid grid-cols-2 items-center gap-8 max-md:mb-8 max-md:grid-cols-1">
		<div class="flex justify-center max-md:justify-center">
			<div class="max-w-[300px]">
				<img src="/icons/selling.svg" alt="lecom selling" />
			</div>
		</div>
		<div>
			<h3 class="text-header2">Teach what you love. Sell what they need.</h3>
			<p class="mt-2">
				Share your knowledge with free courses or sell your own products — all on one platform. We
				handle the tech so you can focus on creating and connecting with learners.
			</p>

			<h3 class="mt-8">Benefits</h3>
			<div class="mt-2 flex flex-col gap-2">
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--video]"></span>
					Create and host courses easily
				</div>
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--box-open]"></span>
					Sell your products directly
				</div>
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--credit-card]"></span>
					Built-in payments
				</div>
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--globe-americas]"></span>
					Reach a growing community
				</div>
			</div>
		</div>
	</div>

	<a href="/auth/register" class="btn mt-8 btn-primary">
		Register and start selling now <span class="icon-[fa7-solid--arrow-right]"></span>
	</a>
</section>
