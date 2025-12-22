<script lang="ts">
	import SellerCourseForm from '$lib/components/form/SellerCourseForm.svelte';
	import CreateCourseLessonModalContent from '$lib/components/modal/CreateCourseLessonModalContent.svelte';
	import OpenModalButton from '$lib/components/modal/OpenModalButton.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import {
		addCourseSectionSchema,
		deleteCourseLessonSchema,
		deleteCourseSectionSchema,
		type AddCourseSectionSchema,
		type DeleteCourseLessonSchema,
		type DeleteCourseSectionSchema,
		type LinkProductSchema
	} from '$lib/schemas/courseSchema';
	import {
		formatVideoDuration,
		toNumericString,
		toRomanNumeral
	} from '$lib/utils/converters';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();

	let addSectionModalRef: HTMLDialogElement | null = $state(null);
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
				Cập nhật thông tin, xây dựng nội dung khóa học và liên kết với các sản phẩm của cửa hàng.
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
							<FormConfirmPopoverButton
								action="?/deleteSection"
								formData={{ sectionId: section.id }}
								popoverId="delete-section-{section.id}"
								openButtonProps={{ class: 'btn btn-square btn-sm btn-error' }}
								dropdownClass="dropdown-bottom dropdown-end"
								dropdownContent={{
									label: 'Xác nhận xóa chương này?',
									description: 'Chương này và toàn bộ nội dung sẽ bị xóa vĩnh viễn',
									confirmBtnClass: 'btn-error',
									confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
									confirmBtnText: 'Xóa'
								}}
							>
								<span class="icon-[fa7-solid--trash-alt]"></span>
							</FormConfirmPopoverButton>
						</div>

						<div class="mt-1">
							{#if section.approvalStatus === 'Pending'}
								<p class="flex items-center gap-1 text-xs text-warning-content">
									<span class="icon-[fa7-solid--hourglass-half]"></span> Đang chờ quản trị viên duyệt
								</p>
							{:else if section.approvalStatus === 'Approved'}
								<p class="flex items-center gap-1 text-xs text-success-content">
									<span class="icon-[mingcute--check-circle-fill]"></span> Đã được chấp thuận
								</p>
							{:else if section.approvalStatus === 'Rejected'}
								<div class="flex items-center gap-1 text-xs text-error-content">
									<span class="icon-[mingcute--close-circle-fill]"></span> Chương học bị từ chối phê
									duyệt
									<div
										class="tooltip flex items-center tooltip-info"
										data-tip="Vui lòng kiểm tra lý do từ chối và cập nhật lại nội dung"
									>
										<span class="ml-1 icon-[mingcute--information-fill] text-info-content"></span>
									</div>
								</div>
								{#if section.moderatorNote}
									<p class="mt-1 text-xs text-error-content">
										Lý do: <strong>{section.moderatorNote}</strong>
									</p>
								{/if}
							{/if}
						</div>

						<div class="mt-2 rounded-field bg-base-300">
							{#if section.lessons.length}
								{#each section.lessons as lesson, ii (lesson.id)}
									<div
										class="flex flex-col gap-2 p-2 {ii !== section.lessons.length - 1
											? 'border-b border-base-100'
											: ''}"
									>
										<div class="flex items-center gap-2">
											<button
												class="btn btn-square btn-ghost btn-primary"
												disabled
												aria-label="play"
											>
												<span
													class="{lesson.type === 'Video'
														? 'icon-[mingcute--video-fill] text-primary-content'
														: 'icon-[mingcute--inventory-fill] text-secondary-content'} text-xl"
												></span>
											</button>
											<p class="line-clamp-2 font-bold">
												{toNumericString(ii + 1)}. {lesson.title}
											</p>
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
											<FormConfirmPopoverButton
												action="?/deleteLesson"
												formData={{ lessonId: lesson.id }}
												popoverId="delete-lesson-{lesson.id}"
												openButtonProps={{ class: 'btn btn-square btn-xs btn-error' }}
												dropdownClass="dropdown-bottom dropdown-end"
												dropdownContent={{
													label: 'Xác nhận xóa bài học này?',
													description: 'Nội dung sẽ bị xóa vĩnh viễn',
													confirmBtnClass: 'btn-error',
													confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
													confirmBtnText: 'Xóa'
												}}
											>
												<span class="icon-[fa7-solid--trash-alt]"></span>
											</FormConfirmPopoverButton>
										</div>

										<div class="flex flex-wrap items-start gap-3 px-2">
											<p class="text-xs font-bold">Sản phẩm đã liên kết:</p>
											{#if lesson.linkedProducts && lesson.linkedProducts.length}
												{#each lesson.linkedProducts as product (product.id)}
													<div class="tooltip tooltip-error" data-tip="Bỏ liên kết sản phẩm">
														<FormConfirmPopoverButton
															action="?/unlinkProduct"
															formData={{
																productId: product.id,
																lessonId: lesson.id
															}}
															popoverId="unlink-product-{product.id}"
															openButtonProps={{
																class: 'group btn btn-sm btn-info hover:btn-error'
															}}
															dropdownClass="dropdown-top dropdown-end"
															dropdownContent={{
																label: 'Bỏ liên kết sản phẩm này?',
																description: `${product.name} sẽ được bỏ liên kết với ${lesson.title}.`,
																confirmBtnClass: 'btn-error',
																confirmBtnIcon: 'icon-[fa7-solid--unlink]',
																confirmBtnText: 'Bỏ liên kết'
															}}
														>
															<Image
																src={product.thumbnailUrl}
																alt={product.name}
																class="h-6 w-6"
															/>
															<p class="line-clamp-1 max-w-50">{product.name}</p>
															<span
																class="icon-[fa7-solid--link] group-hover:icon-[fa7-solid--unlink]"
															></span>
														</FormConfirmPopoverButton>
													</div>
												{/each}
											{:else}
												<p class="text-xs text-base-content/60 italic">
													Chưa liên kết sản phẩm nào
												</p>
											{/if}
										</div>

										<div class="px-2">
											{#if lesson.approvalStatus === 'Pending'}
												<p class="flex items-center gap-1 text-xs text-warning-content">
													<span class="icon-[fa7-solid--hourglass-half]"></span> Đang chờ quản trị viên
													duyệt
												</p>
											{:else if lesson.approvalStatus === 'Approved'}
												<p class="flex items-center gap-1 text-xs text-success-content">
													<span class="icon-[mingcute--check-circle-fill]"></span> Đã được chấp thuận
												</p>
											{:else if lesson.approvalStatus === 'Rejected'}
												<div class="flex items-center gap-1 text-xs text-error-content">
													<span class="icon-[mingcute--close-circle-fill]"></span> Bài học bị từ
													chối phê duyệt
													<div
														class="tooltip flex items-center tooltip-info"
														data-tip="Vui lòng kiểm tra lý do từ chối và cập nhật lại nội dung"
													>
														<span class="ml-1 icon-[mingcute--information-fill] text-info-content"
														></span>
													</div>
												</div>
												{#if lesson.moderatorNote}
													<p class="mt-1 text-xs text-error-content">
														Lý do: <strong>{lesson.moderatorNote}</strong>
													</p>
												{/if}
											{/if}
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
							<OpenModalButton
								ModalContentProps={{
									dataForm: data.addLessonForm,
									courseSectionId: section.id,
									orderIndex: section.lessons.length
								}}
								ModalContent={CreateCourseLessonModalContent}
								openButtonProps={{
									class: 'btn btn-secondary btn-sm'
								}}
								><span class="icon-[mingcute--add-square-line] text-xl"></span>Thêm bài học</OpenModalButton
							>
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
