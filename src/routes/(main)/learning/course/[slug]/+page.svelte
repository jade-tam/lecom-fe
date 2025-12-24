<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';
	import ShopCard from '$lib/components/ui/card/ShopCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import CourseCardSkeleton from '$lib/components/ui/skeleton/CourseCardSkeleton.svelte';
	import FormAction from '$lib/components/wrapper/FormAction.svelte';
	import { getUserProfile } from '$lib/context/appContext';
	import { formatVideoDuration, toNumericString, toRomanNumeral } from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast.js';

	const { data, form } = $props();
	const course = $derived(data.course);

	let isWishlist = $state(false);

	const userProfile = $derived(getUserProfile());

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});
</script>

<section class="flex min-h-screen flex-col gap-4">
	{#if course}
		<AnimatedDiv
			animateVars={{ translateY: -20, opacity: 0 }}
			class="relative mt-4 w-full overflow-hidden rounded-box border bg-base-100"
		>
			<Image
				src={course.courseThumbnail}
				alt={course.title}
				class="h-38 w-full rounded-none"
				border=""
			/>

			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-300/60 to-base-300/10"
			></div>

			<div class="absolute bottom-4 flex gap-2 px-4">
				<h1 class="text-header text-shadow-2xs">{course.title}</h1>
			</div>
		</AnimatedDiv>

		<!-- =================================================================================== -->
		<div class="grid w-full grid-cols-2 justify-stretch gap-4 max-md:grid-cols-1 max-md:gap-2">
			<AnimatedDiv animateVars={{ translateX: -20, opacity: 0 }} class="flex flex-col gap-2">
				<p class="mb-1 flex items-center gap-2 font-bold text-secondary-content">
					<span class="icon-[mingcute--book-5-line] shrink-0 text-xl"></span>Danh mục: {course.categoryName}
				</p>
				{#if userProfile}
					{#if course.isEnrolled}
						<div class="badge badge-success">Đã tham gia khoá học</div>
					{/if}
					<p class="line-clamp-5 text-sm">{course.summary}</p>
					<div class="mt-2 flex gap-2">
						{#if course.isEnrolled}
							<a class="btn grow btn-primary" href="/learn/{course.id}">
								<span class="icon-[fa7-solid--book-open]"></span>Bắt đầu học
							</a>
						{:else}
							<FormAction
								action="?/enroll"
								formData={{
									courseId: course.id
								}}
								class="grow"
							>
								<button type="submit" class="btn w-full btn-primary"
									><span class="icon-[fa7-solid--book-open]"></span>Tham gia khóa học này</button
								>
							</FormAction>
						{/if}
					</div>
				{:else}
					<a type="submit" class="btn btn-primary" href={resolve('/auth/login')}>
						<span class="icon-[mingcute--arrow-to-right-fill] text-lg"></span>Đăng nhập để bắt đầu
						học ngay ngay
					</a>
				{/if}
			</AnimatedDiv>
			<AnimatedDiv animateVars={{ translateX: 20, opacity: 0 }} class="flex flex-col gap-2">
				<ShopCard
					shop={{
						id: course.shop.id,
						shopAvatar: course.shop.avatar,
						description: course.shop.description,
						name: course.shop.name
					}}
				/>
			</AnimatedDiv>
		</div>

		<div class="divider"></div>

		<!-- =================================================================================== -->
		<AnimatedDiv
			animateVars={{ translateY: 20, opacity: 0 }}
			class="w-full overflow-hidden rounded-box border bg-base-100 p-4"
		>
			<h2 class="mb-4">Nội dung khóa học</h2>
			{#if course.sections}
				{#each course.sections as section, i (section.id)}
					<div class="bg-base-100">
						<div class="flex items-center justify-between">
							<p class="text-lg font-black">{toRomanNumeral(i + 1)}. {section.title}</p>
						</div>

						<div class="mt-2 rounded-field bg-base-200">
							{#if section.lessons.length}
								{#each section.lessons as lesson, ii (lesson.id)}
									<div
										class="flex items-center gap-2 p-2 {ii !== section.lessons.length - 1
											? 'border-b border-base-100'
											: ''}"
									>
										<button
											class="btn btn-square btn-ghost btn-sm btn-primary"
											disabled
											aria-label="play"
										>
											<span
												class="{lesson.type === 'Video'
													? 'icon-[mingcute--video-fill] text-primary-content'
													: 'icon-[mingcute--inventory-fill] text-secondary-content'} text-xl"
											></span>
										</button>
										<p class="font-semibold">{toNumericString(ii + 1)}. {lesson.title}</p>
										<p class="mr-4 ml-auto flex items-center gap-2 text-xs text-secondary-content">
											{formatVideoDuration(lesson.durationSeconds)}<span
												class="icon-[fa7-solid--clock]"
											></span>
										</p>
									</div>
								{/each}
							{:else}
								<p class="p-2 text-xs text-base-content/60 italic">Phần này chưa có bài học nào</p>
							{/if}
						</div>
					</div>
				{/each}
			{:else}
				<EmptyPlaceholder text="Khóa học này chưa có nội dung" />
			{/if}
		</AnimatedDiv>

		<!-- =================================================================================== -->
		<div class="col-span-2 rounded-box border bg-base-100 p-6 max-md:p-4">
			<p class="text-header3">Khoá học tương tự</p>

			{#await data.similarCoursesPromise}
				<div class="mt-4 grid grid-cols-4 gap-2 max-lg:grid-cols-2">
					<CourseCardSkeleton />
					<CourseCardSkeleton />
					<CourseCardSkeleton />
					<CourseCardSkeleton />
				</div>
			{:then similarCourses}
				{#if similarCourses.length}
					<div class="mt-4 grid grid-cols-4 gap-2 gap-y-6 max-lg:grid-cols-2">
						{#each similarCourses.slice(0, 4) as similarCourse (similarCourse.id)}
							<CourseCard course={similarCourse} />
						{/each}
					</div>
				{:else}
					<EmptyPlaceholder text="Không tìm thấy khóa học tương tự" />
				{/if}
			{/await}
		</div>
	{:else}
		<EmptyPlaceholder text="Khóa học không tồn tại" />
	{/if}
</section>
