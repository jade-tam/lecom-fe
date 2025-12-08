<script>
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';

	const { data } = $props();

	const badgeColors = ['badge-info', 'badge-success', 'badge-secondary', 'badge-primary'];
</script>

<section>
	<div class="my-48 grid grid-cols-2 items-center gap-8 max-md:my-12 max-md:grid-cols-1">
		<div>
			<h1>Học tập dễ dàng. Mua sắm thông minh.</h1>
			<p class="mt-2">
				Tiếp cận các khóa học trực tuyến 100% miễn phí để nâng cao kiến thức và kỹ năng — đồng thời
				khám phá những sản phẩm giúp việc học trở nên dễ dàng, thú vị và hiệu quả hơn.
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
	<h2 class="text-header1">Khóa học miễn phí cho mọi người</h2>
	<div class="my-16 grid grid-cols-2 items-center gap-8 max-md:mb-8 max-md:grid-cols-1">
		<div class="flex justify-center max-md:justify-center">
			<div class="max-w-[300px]">
				<img src="/icons/learning-tutorial.svg" alt="lecom hero" />
			</div>
		</div>
		<div>
			<h3 class="text-header2">Học kiến thức mới — hoàn toàn miễn phí</h3>
			<p class="mt-2">
				Tham gia các khóa học trực tuyến được chia sẻ bởi chuyên gia và những người đam mê. Bạn có
				thể tìm hiểu về hàng ngàn khoá học hoàn toán miễn phí về các lĩnh vực sáng tạo hoặc các kiến
				thức về phát triển bản thân tại LECOM.
			</p>

			<h3 class="mt-8">Danh mục khoá học nổi bật</h3>
			<div class="mt-2 flex flex-wrap gap-2">
				{#await data.landingPageData}
					{#each Array(4) as skeleton}
						<div class="h-4 w-16 skeleton"></div>
					{/each}
				{:then lpData}
					{#each lpData.topCourseCategories?.slice(0, 4) as category, i (category.id)}
						<div class={`badge badge-lg ${badgeColors[i % badgeColors.length]}`}>
							<span class="icon-[fa7-solid--bookmark]"></span>
							{category.name}
						</div>
					{/each}
				{:catch err}
					<p class="text-error">Không thể tải danh mục nổi bật</p>
				{/await}
			</div>
		</div>
	</div>

	<h3 class="self-start">Các khóa học phổ biến</h3>
	<div class="grid w-full grid-cols-4 items-stretch gap-4 py-2 max-md:grid-cols-2">
		{#await data.landingPageData}
			{#each Array(4) as skeleton}
				<div class="h-64 w-full skeleton"></div>
			{/each}
		{:then lpData}
			{#each lpData.popularCourses?.slice(0, 4) as course (course.id)}
				<CourseCard {course} />
			{/each}
		{:catch err}
			<p class="text-error">Không thể tải danh sách khóa học phổ biến</p>
		{/await}
	</div>

	<a href="/learning" class="btn mt-8 btn-primary">
		Xem tất cả khóa học <span class="icon-[fa7-solid--arrow-right]"></span>
	</a>
</section>

<!-- ========================================================================================== -->

<section class="mt-64 flex flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Mua sắm sản phẩm hỗ trợ cho việc học</h2>
	<div class="my-16 grid grid-cols-2 items-center gap-8 max-md:mb-8 max-md:grid-cols-1">
		<div>
			<h3 class="text-header2">Mua sắm những sản phẩm và công cụ hỗ trợ cho việc học của bạn.</h3>
			<p class="mt-2">
				Từ sổ tay, bộ dụng cụ học tập đến các thiết bị và công cụ sáng tạo — Bạn có thể dễ dàng tìm
				những sản phẩm hữu ích để giúp bạn luôn có cảm hứng, tập trung và hiệu quả hơn trong quá
				trình học tập.
			</p>

			<h3 class="mt-8">Danh mục sản phẩm nổi bật</h3>
			<div class="mt-2 flex flex-wrap gap-2">
				{#await data.landingPageData}
					{#each Array(4) as skeleton}
						<div class="h-4 w-16 skeleton"></div>
					{/each}
				{:then lpData}
					{#each lpData.topProductCategories?.slice(0, 4) as category, i (category.id)}
						<div class={`badge badge-lg ${badgeColors[i % badgeColors.length]}`}>
							<span class="icon-[fa7-solid--box-open]"></span>
							{category.name}
						</div>
					{/each}
				{:catch err}
					<p class="text-error">Không thể tải danh mục sản phẩm</p>
				{/await}
			</div>
		</div>
		<div class="flex justify-center max-md:justify-center">
			<div class="max-w-[300px]">
				<img src="/icons/shopping.svg" alt="lecom hero" />
			</div>
		</div>
	</div>

	<h3 class="self-start">Sản phẩm bán chạy nhất</h3>
	<div class="grid w-full grid-cols-4 items-stretch gap-4 py-2 max-md:grid-cols-2">
		{#await data.landingPageData}
			{#each Array(4) as skeleton}
				<div class="h-64 w-full skeleton"></div>
			{/each}
		{:then lpData}
			{#each lpData.bestSellerProducts?.slice(0, 4) as product (product.id)}
				<ProductCard {product} />
			{/each}
		{:catch err}
			<p class="text-error">Không thể tải danh sách sản phẩm bán chạy</p>
		{/await}
	</div>

	<a href="/shopping" class="btn mt-8 btn-primary">
		Bắt đầu mua sắm ngay <span class="icon-[fa7-solid--arrow-right]"></span>
	</a>
</section>

<!-- ========================================================================================== -->

<section class="mt-64 mb-32 flex flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Dạy học và bán hàng cùng LECOM</h2>
	<div class="my-16 grid grid-cols-2 items-center gap-8 max-md:mb-8 max-md:grid-cols-1">
		<div class="flex justify-center max-md:justify-center">
			<div class="max-w-[300px]">
				<img src="/icons/selling.svg" alt="lecom selling" />
			</div>
		</div>
		<div>
			<h3 class="text-header2">Dạy điều bạn yêu thích. Bán điều họ cần.</h3>
			<p class="mt-2">
				Chia sẻ kiến thức qua các khóa học miễn phí hoặc bán sản phẩm của riêng bạn — tất cả trên
				cùng một nền tảng. Chúng tôi đã lo phần công nghệ để bạn có thể tập trung vào việc sáng tạo
				và kết nối với người học.
			</p>

			<h3 class="mt-8">Lợi ích</h3>
			<div class="mt-2 flex flex-col gap-2">
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--video]"></span>
					Tạo và quản lý khóa học dễ dàng
				</div>
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--box-open]"></span>
					Bán sản phẩm của bạn trực tiếp
				</div>
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--credit-card]"></span>
					Tích hợp công cụ thanh toán sẵn
				</div>
				<div class="badge badge-lg badge-secondary">
					<span class="icon-[fa7-solid--globe-americas]"></span>
					Tiếp cận cộng đồng người dùng đang phát triển
				</div>
			</div>
		</div>
	</div>

	<a href="/auth/register" class="btn mt-8 btn-primary">
		Đăng ký và bắt đầu bán ngay <span class="icon-[fa7-solid--arrow-right]"></span>
	</a>
</section>
