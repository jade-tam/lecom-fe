<script lang="ts">
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import { userActiveStatusOptions, userRoleOptions, type User } from '$lib/types/User';
	import {
		getUserActiveStatusBadgeClass,
		getUserRoleBadgeClass,
		getUserRoleBtnClass
	} from '$lib/utils/classComposer';
	import { formatDate } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';
	import AdminToggleRolePopoverButton from './AdminToggleRolePopoverButton.svelte';

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
				{ id: 'roles', key: 'roles', name: 'Vai trò' },
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
			name="roles"
			{table}
			options={userRoleOptions}
			getFilterBtnClass={getUserRoleBtnClass}
		/>
		<SearchInput bind:value={table.globalFilter} />
	</div>
</div>

<div class="rounded-box border bg-base-100 p-4">
	<div class="overflow-x-auto">
		<table class="table table-sm">
			<thead>
				<tr class="text-base-content">
					{#each table.columns as column (column.id)}
						<th>
							<button
								class="flex items-center gap-1"
								onclick={() => table.toggleSort(column.id)}
								disabled={!table.isSortable(column.id)}
							>
								{column.name}
								<!-- SORT BUTTON -->
								{#if table.isSortable(column.id)}
									{#if table.getSortState(column.id) === 'asc'}
										<span class="icon-[mingcute--sort-ascending-fill] text-primary-content"></span>
									{:else if table.getSortState(column.id) === 'desc'}
										<span class="icon-[mingcute--sort-descending-fill] text-primary-content"></span>
									{:else}
										<span class="icon-[mingcute--menu-fill] text-base-content/20"></span>
									{/if}
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
							{:else if column.id === 'roles'}
								<td >
									<div class="flex flex-col gap-1">
										{#if Array.isArray(row.roles)}
											{#each row.roles as role}
												{#if role !== 'Customer'}
													<div class="badge badge-sm {getUserRoleBadgeClass(role)}">
														{role}
													</div>
												{/if}
											{/each}
										{:else if row.roles}
											<div class="badge badge-sm {getUserRoleBadgeClass(row.roles)}">
												{row.roles}
											</div>
										{/if}
									</div>
								</td>
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

								<AdminToggleRolePopoverButton user={row} />

								<div class="tooltip" data-tip={row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
									<FormConfirmPopoverButton
										action="?/{row.isActive ? 'deactivate' : 'activate'}"
										formData={{ id: row.id }}
										popoverId="toggle-user-{row.id}"
										openButtonProps={{ class: 'btn btn-square btn-primary' }}
										dropdownClass="dropdown-bottom dropdown-end"
										dropdownContent={{
											label: `${row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} người dùng ${row.userName}?`,
											description: `Người dùng này sẽ được chuyển sang trạng thái ${row.isActive ? 'không hoạt động' : 'hoạt động'}.`,
											confirmBtnClass: 'btn-primary',
											confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
											confirmBtnText: row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'
										}}
									>
										<span
											class="{row.isActive
												? 'icon-[fa7-solid--user-lock]'
												: 'icon-[fa7-solid--user-check]'} text-xl"
										></span>
									</FormConfirmPopoverButton>
								</div>

								<div class="tooltip" data-tip="Xóa">
									<FormConfirmPopoverButton
										action="?/delete"
										formData={{ id: row.id }}
										popoverId="delete-user-{row.id}"
										openButtonProps={{ class: 'btn btn-square btn-error' }}
										dropdownClass="dropdown-bottom dropdown-end"
										dropdownContent={{
											label: `Xóa ${row.userName}?`,
											description: 'Người dùng này sẽ bị xóa vĩnh viễn',
											confirmBtnClass: 'btn-error',
											confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
											confirmBtnText: 'Xóa'
										}}
									>
										<span class="icon-[fa7-solid--user-slash] text-xl"></span>
									</FormConfirmPopoverButton>
								</div>
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
