<script lang="ts">
	import { enhance } from '$app/forms';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { userActiveStatusOptions, userRoleOptions, type User } from '$lib/types/User';
	import {
		getUserActiveStatusBadgeClass,
		getUserRoleBadgeClass,
		getUserRoleBtnClass
	} from '$lib/utils/classComposer';
	import { formatDate } from '$lib/utils/converters';
	import { haveAuthorization } from '$lib/utils/others';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { users }: { users: User[] } = $props();

	const pageSize = 12;

	const table = $derived(
		new DataTable({
			pageSize: pageSize,
			data: users,
			columns: [
				{ id: 'userName', key: 'userName', name: 'Tên đăng nhập' },
				{ id: 'fullName', key: 'fullName', name: 'Họ và tên' },
				{ id: 'email', key: 'email', name: 'Email' },
				{ id: 'phoneNumber', key: 'phoneNumber', name: 'Số điện thoại' },
				{ id: 'dateOfBirth', key: 'dateOfBirth', name: 'Ngày sinh' },
				{ id: 'role', key: 'role', name: 'Vai trò' },
				{ id: 'isActive', key: 'isActive', name: 'Trạng thái hoạt động' }
			]
		})
	);
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Quản lý người dùng</h1>
		<p class="text-base-content/60">Xem và quản lý người dùng trên nền tảng.</p>
	</div>

	<div class="flex gap-2">
		<TableFilter
			name="role"
			{table}
			options={userRoleOptions}
			getFilterBtnClass={getUserRoleBtnClass}
		/>
		<SearchInput bind:value={table.globalFilter} />
	</div>
</div>

<div class="rounded-box border bg-base-100 p-4">
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr class="text-base-content">
					{#each table.columns as column (column.id)}
						<th>
							<button
								class="flex items-center"
								onclick={() => table.toggleSort(column.id)}
								disabled={!table.isSortable(column.id)}
							>
								{column.name}
								<!-- SORT BUTTON -->
								{#if table.isSortable(column.id)}
									<span class="ml-2">
										{#if table.getSortState(column.id) === 'asc'}
											<span class="icon-[fa7-solid--sort-asc]"></span>
										{:else if table.getSortState(column.id) === 'desc'}
											<span class="icon-[fa7-solid--sort-desc]"></span>
										{:else}{/if}
									</span>
								{/if}
							</button>
						</th>
					{/each}
					<th>Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'isActive'}
								<td
									><div class={`badge ${getUserActiveStatusBadgeClass(row.isActive)}`}>
										{userActiveStatusOptions.find((option) => option.value === row.isActive)?.title}
									</div></td
								>
							{:else if column.id === 'dateOfBirth'}
								<td>{formatDate(row.dateOfBirth)}</td>
							{:else if column.id === 'role'}
								<td
									><div class={`badge ${getUserRoleBadgeClass(row.role)}`}>
										{userRoleOptions.find((option) => option.value === row.role)?.title}
									</div></td
								>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
						<td>
							<div class="flex gap-1">
								<div class="tooltip" data-tip="Xem chi tiết người dùng">
									<a
										href={`/admin/users-management/${row['id']}`}
										class="btn btn-square btn-secondary"
										aria-label="xem chi tiết người dùng"
									>
										<span class="icon-[fa7-solid--eye] text-xl"></span>
									</a>
								</div>

								<div class="dropdown dropdown-left">
									<div class="tooltip" data-tip="Cập nhật vai trò">
										<button
											type="button"
											class="btn btn-square btn-info"
											aria-label="Cập nhật vai trò"
										>
											<span class="icon-[fa7-solid--user-shield] text-xl"></span>
										</button>
									</div>

									<div
										tabindex="-1"
										class="dropdown-content m-1 flex w-64 flex-col gap-2 rounded-field border bg-base-100 p-4 shadow"
									>
										<p class="font-bold">Cập nhật vai trò</p>
										<p class="text-xs text-base-content/60">
											Chỉnh sửa vai trò cho người dùng này bằng cách bật tắt nút phía dưới
										</p>
										<div class="flex gap-2">
											<form method="POST" action="?/toggleRole" use:enhance>
												<button
													class={`btn ${haveAuthorization(row.role, 'Moderator') ? '' : 'btn-dash'} btn-sm ${getUserRoleBtnClass('Moderator')}`}
													type="submit"
													name="role"
													aria-label="Moderator"
												>
													Moderator
												</button>
												<input type="hidden" name="userId" value={row.id} />
												<input type="hidden" name="role" value="Moderator" />
												<input
													type="hidden"
													name="isAlreadyHaveRole"
													value={haveAuthorization(row.role, 'Moderator')}
												/>
											</form>
											<form method="POST" action="?/toggleRole" use:enhance>
												<button
													class={`btn ${haveAuthorization(row.role, 'Admin') ? '' : 'btn-dash'} btn-sm ${getUserRoleBtnClass('Admin')}`}
													type="submit"
													name="role"
													aria-label="Admin"
												>
													Admin
												</button>
												<input type="hidden" name="userId" value={row.id} />
												<input type="hidden" name="role" value="Admin" />
												<input
													type="hidden"
													name="isAlreadyHaveRole"
													value={haveAuthorization(row.role, 'Admin')}
												/>
											</form>
										</div>
									</div>
								</div>

								<FormConfirmDropdownAction
									label="{row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} người dùng {row.userName}?"
									description="Người dùng này sẽ được chuyển sang trạng thái {row.isActive
										? 'không hoạt động'
										: 'hoạt động'}."
									action="?/{row.isActive ? 'deactivate' : 'activate'}"
									formData={{ id: row.id }}
								>
									<div class="tooltip" data-tip={row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
										<button
											type="button"
											class="btn btn-square btn-primary"
											aria-label={row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
										>
											<span
												class="{row.isActive
													? 'icon-[fa7-solid--user-lock]'
													: 'icon-[fa7-solid--user-check]'} text-xl"
											></span>
										</button>
									</div>
								</FormConfirmDropdownAction>

								<FormConfirmDropdownAction
									label={`Xóa ${row.userName}?`}
									description="Người dùng này sẽ bị xóa vĩnh viễn"
									action="?/delete"
									formData={{ id: row.id }}
								>
									<div class="tooltip" data-tip="Xóa">
										<button class="btn btn-square btn-error" type="button" aria-label="xóa">
											<span class="icon-[fa7-solid--user-slash] text-xl"></span>
										</button>
									</div>
								</FormConfirmDropdownAction>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</div>
