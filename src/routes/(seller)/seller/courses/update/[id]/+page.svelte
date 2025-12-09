<script lang="ts">
	import SellerCourseForm from '$lib/components/form/SellerCourseForm.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormMediaInput from '$lib/components/ui/FormMediaInput.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import {
		addCourseLessonSchema,
		addCourseSectionSchema,
		deleteCourseLessonSchema,
		deleteCourseSectionSchema,
		type AddCourseLessonSchema,
		type AddCourseSectionSchema,
		type DeleteCourseLessonSchema,
		type DeleteCourseSectionSchema,
		type LinkProductSchema
	} from '$lib/schemas/courseSchema';
	import { formatVideoDuration, toNumericString, toRomanNumeral } from '$lib/utils/converters';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();

	let addSectionModalRef: HTMLDialogElement | null = $state(null);
	let addLessonModalRef: HTMLDialogElement | null = $state(null);
	let linkProductModalRef: HTMLDialogElement | null = $state(null);

	const {
		form: sectionForm,
		errors: sectionErrors,
		message: sectionMessage,
		enhance: sectionEnhance,
		submitting: sectionSubmitting,
		delayed: sectionDelayed,
		tainted: sectionTainted,
		isTainted: sectionIsTainted,
		submit: sectionSubmit
	} = superForm<AddCourseSectionSchema, ToastData>(data.addSectionForm, {
		validators: zod4Client(addCourseSectionSchema)
	});

	const {
		form: lessonForm,
		errors: lessonErrors,
		message: lessonMessage,
		enhance: lessonEnhance,
		submitting: lessonSubmitting,
		delayed: lessonDelayed,
		tainted: lessonTainted,
		isTainted: lessonIsTainted,
		submit: lessonSubmit
	} = superForm<AddCourseLessonSchema, ToastData>(data.addLessonForm, {
		validators: zod4Client(addCourseLessonSchema)
	});

	const {
		form: deleteSectionForm,
		errors: deleteSectionErrors,
		message: deleteSectionMessage,
		enhance: deleteSectionEnhance,
		submitting: deleteSectionSubmitting,
		delayed: deleteSectionDelayed,
		tainted: deleteSectionTainted,
		isTainted: deleteSectionIsTainted,
		submit: deleteSectionSubmit
	} = superForm<DeleteCourseSectionSchema, ToastData>(data.deleteSectionForm, {
		validators: zod4Client(deleteCourseSectionSchema)
	});

	const {
		form: deleteLessonForm,
		errors: deleteLessonErrors,
		message: deleteLessonMessage,
		enhance: deleteLessonEnhance,
		submitting: deleteLessonSubmitting,
		delayed: deleteLessonDelayed,
		tainted: deleteLessonTainted,
		isTainted: deleteLessonIsTainted,
		submit: deleteLessonSubmit
	} = superForm<DeleteCourseLessonSchema, ToastData>(data.deleteLessonForm, {
		validators: zod4Client(deleteCourseLessonSchema)
	});

	const {
		form: linkProductForm,
		errors: linkProductErrors,
		message: linkProductMessage,
		enhance: linkProductEnhance,
		submitting: linkProductSubmitting,
		delayed: linkProductDelayed,
		tainted: linkProductTainted,
		isTainted: linkProductIsTainted,
		submit: linkProductSubmit,
		reset: linkProductReset
	} = superForm<LinkProductSchema, ToastData>(data.linkProductForm, {
		validators: zod4Client(deleteCourseLessonSchema)
	});

	$effect(() => {
		if ($sectionMessage) {
			showToast($sectionMessage);
			addSectionModalRef?.close();
		}
	});

	$effect(() => {
		if ($lessonMessage) {
			showToast($lessonMessage);
			addLessonModalRef?.close();
		}
	});
	$effect(() => {
		if ($deleteSectionMessage) {
			showToast($deleteSectionMessage);
		}
	});

	$effect(() => {
		if ($deleteLessonMessage) {
			showToast($deleteLessonMessage);
		}
	});

	$effect(() => {
		if ($linkProductMessage) {
			showToast($linkProductMessage);

			if ($linkProductMessage.type === 'success') {
				linkProductReset();
				linkProductModalRef?.close();
			}
		}
	});
</script>

<!-- ===================================================================================== -->

<dialog bind:this={addSectionModalRef} class="modal">
	<div class="modal-box">
		<form action="?/addSection" method="POST" use:sectionEnhance>
			<h3 class="text-lg font-bold">Thêm chương mới</h3>

			<FormInput
				name="title"
				label="Tiêu đề chương"
				placeholder="Nhập tiêu đề chương..."
				superForm={sectionForm}
				errors={sectionErrors}
			/>

			<FormInput
				name="orderIndex"
				label="Thứ tự"
				hidden
				superForm={sectionForm}
				errors={sectionErrors}
			/>

			<div class="modal-action">
				<button class="btn" type="button" onclick={() => addSectionModalRef?.close()}>Hủy</button>
				<button class="btn btn-primary" type="submit">Thêm chương</button>
			</div>
		</form>
	</div>
</dialog>

<!-- ===================================================================================== -->

<dialog bind:this={addLessonModalRef} class="modal">
	<div class="modal-box">
		<form action="?/addLesson" method="POST" use:lessonEnhance>
			<h3 class="text-lg font-bold">Thêm bài học mới</h3>

			<FormInput
				name="title"
				label="Tiêu đề bài học"
				placeholder="Nhập tiêu đề bài học..."
				superForm={lessonForm}
				errors={lessonErrors}
			/>

			<FormMediaInput
				name="contentUrl"
				label="Video bài học"
				help="Có thể mất thời gian để tải lên video dài"
				mediaType="Video"
				aspectRatio="16:9"
				superForm={lessonForm}
				errors={lessonErrors}
				onUploadSuccess={({ url, duration }) => {
					console.log('✅ Upload done:', url, duration);
					if (duration) $lessonForm.durationSeconds = duration;
				}}
			/>

			<FormInput
				hidden
				name="durationSeconds"
				label="Thời lượng (giây)"
				superForm={lessonForm}
				errors={lessonErrors}
			/>

			<FormInput
				hidden
				name="orderIndex"
				label="Thứ tự"
				superForm={lessonForm}
				errors={lessonErrors}
			/>

			<FormInput
				hidden
				name="courseSectionId"
				label="ID chương"
				superForm={lessonForm}
				errors={lessonErrors}
			/>

			<div class="modal-action">
				<button class="btn" type="button" onclick={() => addLessonModalRef?.close()}>Hủy</button>
				<button class="btn btn-primary" type="submit">Thêm bài học</button>
			</div>
		</form>
	</div>
</dialog>

<!-- ===================================================================================== -->

<dialog bind:this={linkProductModalRef} class="modal">
	<div class="modal-box">
		<form action="?/linkProduct" method="POST" use:linkProductEnhance>
			<h3 class="text-lg font-bold">Liên kết sản phẩm</h3>
			<p class="mb-2 text-xs text-base-content/60">
				Chọn sản phẩm liên quan để hỗ trợ học viên học tốt hơn.
			</p>

			<FormInput
				name="lessonTitle"
				label="Bài học đã chọn"
				placeholder="Không được để trống"
				superForm={linkProductForm}
				errors={linkProductErrors}
				icon="icon-[fa7-solid--book]"
				readonly
			/>

			<FormInput
				name="productName"
				label="Sản phẩm đã chọn"
				placeholder="Chọn sản phẩm để liên kết"
				superForm={linkProductForm}
				errors={linkProductErrors}
				icon="icon-[fa7-solid--box-open]"
				help="Chọn một sản phẩm từ danh sách bên dưới"
				readonly
			/>

			{#await data.products}
				<div class="flex gap-2">
					<div class="loading loading-infinity"></div>
					<p class="text-sm">Đang tải sản phẩm</p>
				</div>
			{:then products}
				{#if products.length}
					<div
						class="mt-1 flex max-h-64 w-full flex-col gap-1 overflow-auto rounded-field border p-1"
					>
						{#each products as product (product.id)}
							<div class="flex gap-1">
								<button
									type="button"
									class="btn grow items-center justify-start btn-sm {$linkProductForm.productId ===
									product.id
										? 'btn-primary'
										: ''}"
									onclick={() => {
										$linkProductForm.productId = product.id;
										$linkProductForm.productName = product.name;
									}}
								>
									<Image
										src={product.images.find((img) => img.isPrimary)?.url}
										alt={product.name}
										class="h-6 w-6"
									/>
									<p class="line-clamp-1 max-w-84 max-md:max-w-52">{product.name}</p>
									{#if $linkProductForm.productId === product.id}
										<span class="icon-[fa7-solid--check-square]"></span>
									{/if}
								</button>
								<a
									href="/shopping/product/{product.slug}"
									class="btn btn-square btn-sm btn-secondary"
									target="_blank"
									aria-label="Xem sản phẩm"
								>
									<span class="icon-[fa7-solid--eye]"></span>
								</a>
							</div>
						{/each}
					</div>
				{:else}
					<EmptyPlaceholder text="Shop của bạn chưa có sản phẩm nào" />
				{/if}
			{/await}

			<FormInput
				hidden
				name="lessonId"
				label="ID bài học"
				superForm={linkProductForm}
				errors={linkProductErrors}
			/>

			<FormInput
				hidden
				name="productId"
				label="ID sản phẩm"
				superForm={linkProductForm}
				errors={linkProductErrors}
			/>

			<div class="modal-action">
				<button
					class="btn"
					type="button"
					onclick={() => {
						linkProductModalRef?.close();
						linkProductReset();
					}}>Hủy</button
				>
				<button class="btn btn-primary" type="submit">Xác nhận</button>
			</div>
		</form>
	</div>
</dialog>

<!-- ===================================================================================== -->
<div class="my-2 flex flex-col justify-between overflow-x-auto">
	<div class="flex items-center gap-4">
		<a href="/seller/courses" aria-label="Quay lại danh sách khóa học" class="btn btn-square">
			<span class="icon-[fa7-solid--arrow-left]"></span>
		</a>
		<div class="flex flex-col">
			<h1 class="text-header3 font-bold">Cập nhật khóa học</h1>
			<p class="text-base-content/60">
				Cập nhật thông tin, xây dựng khóa học micro-learning và liên kết với sản phẩm của shop.
			</p>
		</div>
	</div>

	<SellerCourseForm dataForm={data.form} categories={data.categories} mode="update" />

	<div class="mt-4 h-fit w-full rounded-box border bg-base-100 p-4">
		<div class="flex items-center justify-between">
			<h1 class="text-header3 font-bold">Nội dung khóa học</h1>
		</div>

		{#await data.sections}
			<div class="flex flex-col gap-2">
				<div class="h-16 w-full skeleton rounded-field"></div>
				<div class="h-16 w-full skeleton rounded-field"></div>
			</div>
		{:then sections}
			{#if sections.length}
				{#each sections as section, i (section.id)}
					<div class="mt-2 rounded-box bg-base-200 p-4">
						<div class="flex items-center justify-between">
							<p class="text-lg font-black">{toRomanNumeral(i + 1)}. {section.title}</p>
							<FormConfirmDropdownAction
								formData={{ sectionId: section.id }}
								label="Xác nhận xóa chương này?"
								action="?/deleteSection"
								description="Chương này và toàn bộ nội dung sẽ bị xóa vĩnh viễn"
								confirmButtonClass="btn-error"
							>
								<button class="btn btn-square btn-sm btn-error" type="button" aria-label="delete">
									<span class="icon-[fa7-solid--trash-alt]"></span>
								</button>
							</FormConfirmDropdownAction>
						</div>

						<div class="mt-2 rounded-field bg-base-300">
							{#if section.lessons.length}
								{#each section.lessons as lesson, ii (lesson.id)}
									<div
										class="flex flex-col gap-2 p-2 {ii !== section.lessons.length - 1
											? 'border-b border-secondary'
											: ''}"
									>
										<div class="flex items-center gap-2">
											<button class="btn btn-square btn-ghost btn-primary" aria-label="play">
												<span class="icon-[fa7-solid--circle-play]"></span>
											</button>
											<p class="line-clamp-2">{toNumericString(ii + 1)}. {lesson.title}</p>
											<p
												class="mr-4 ml-auto flex items-center gap-2 text-xs text-secondary-content"
											>
												{formatVideoDuration(lesson.durationSeconds)}<span
													class="icon-[fa7-solid--clock]"
												></span>
											</p>
											<button
												class="btn btn-xs btn-info"
												aria-label="Liên kết sản phẩm"
												onclick={() => {
													$linkProductForm.lessonTitle = lesson.title;
													$linkProductForm.lessonId = lesson.id;
													linkProductModalRef?.showModal();
												}}
											>
												<span class="icon-[fa7-solid--box-open]"></span>Liên kết sản phẩm
											</button>
											<FormConfirmDropdownAction
												formData={{ lessonId: lesson.id }}
												label="Xác nhận xóa bài học này?"
												action="?/deleteLesson"
												description="Nội dung sẽ bị xóa vĩnh viễn"
												confirmButtonClass="btn-error"
											>
												<button
													class="btn btn-square btn-xs btn-error"
													type="button"
													aria-label="delete"
												>
													<span class="icon-[fa7-solid--trash-alt]"></span>
												</button>
											</FormConfirmDropdownAction>
										</div>

										<div class="flex flex-wrap items-start gap-3 px-2">
											<p class="text-xs font-bold">Sản phẩm đã liên kết:</p>
											{#each lesson.linkedProducts as product (product.id)}
												<FormConfirmDropdownAction
													label="Bỏ liên kết sản phẩm này?"
													description="{product.name} sẽ được bỏ liên kết với {lesson.title}."
													action="?/unlinkProduct"
													confirmButtonIcon="icon-[fa7-solid--unlink]"
													dropdownDirection="dropdown-top"
													formData={{
														productId: product.id,
														lessonId: lesson.id
													}}
												>
													<div class="tooltip tooltip-error" data-tip="Bỏ liên kết sản phẩm">
														<button
															class="group btn btn-sm btn-info hover:btn-error"
															type="button"
															aria-label="delete"
														>
															<Image
																src={product.thumbnailUrl}
																alt={product.name}
																class="h-6 w-6"
															/>
															<p>{product.name}</p>
															<span
																class="icon-[fa7-solid--link] group-hover:icon-[fa7-solid--unlink]"
															></span>
														</button>
													</div>
												</FormConfirmDropdownAction>
											{/each}
										</div>
									</div>
								{/each}
							{:else}
								<p class="p-2 text-xs text-base-content/60 italic">
									Chưa có bài học, hãy thêm bài học mới
								</p>
							{/if}
						</div>

						<div class="mt-2 flex justify-end">
							<button
								class="btn btn-secondary"
								aria-label="Thêm bài học"
								onclick={() => {
									$lessonForm.courseSectionId = section.id;
									$lessonForm.orderIndex = section.lessons.length;
									addLessonModalRef?.showModal();
								}}
							>
								<span class="icon-[fa7-solid--add]"></span>Thêm bài học
							</button>
						</div>
					</div>
				{/each}
			{:else}
				<p class="p-2 text-xs text-base-content/60 italic">Chưa có chương, hãy thêm chương mới</p>
			{/if}

			<div class="mt-2 flex justify-end gap-2">
				<button
					class="btn btn-primary"
					type="submit"
					onclick={() => {
						$sectionForm.orderIndex = sections.length;
						addSectionModalRef?.showModal();
					}}
				>
					<span class="icon-[fa7-solid--add]"></span>Thêm chương
				</button>
			</div>
		{/await}
	</div>
</div>
