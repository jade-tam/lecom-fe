<script lang="ts">
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
	import { DataTable } from '@careswitch/svelte-data-table';

	const { users }: { users: User[] } = $props();

	const pageSize = 12;

	const table = new DataTable({
		pageSize: pageSize,
		data: users,
		columns: [
			{ id: 'userName', key: 'userName', name: 'Username' },
			{ id: 'fullName', key: 'fullName', name: 'Full Name' },
			{ id: 'email', key: 'email', name: 'Email' },
			{ id: 'phoneNumber', key: 'phoneNumber', name: 'Phone Number' },
			{ id: 'dateOfBirth', key: 'dateOfBirth', name: 'Date Of Birth' },
			{ id: 'role', key: 'role', name: 'Role' },
			{ id: 'isActive', key: 'isActive', name: 'Active Status' }
		]
	});
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Users Management</h1>
		<p class="text-base-content/60">View, and manage users on platform.</p>
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
					<th>Actions</th>
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
								<div class="tooltip" data-tip="View user detail">
									<a
										href={`/admin/users-management/${row['id']}`}
										class="btn btn-square btn-secondary"
										aria-label="view user detail"
									>
										<span class="icon-[fa7-solid--eye] text-xl"></span>
									</a>
								</div>
								<FormConfirmDropdownAction
									label="{row.isActive ? 'Deactivate' : 'Activate'} user {row.userName}?"
									description="This user will be become {row.isActive ? 'inactive' : 'active'}."
									action="?/{row.isActive ? 'deactivate' : 'activate'}"
									formData={{ id: row.id }}
								>
									<div class="tooltip" data-tip={row.isActive ? 'Deactivate' : 'Activate'}>
										<button
											type="button"
											class="btn btn-square btn-primary"
											aria-label={row.isActive ? 'Deactivate' : 'Activate'}
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
									label={`Delete ${row.userName}?`}
									description="This user will be deleted forever"
									action="?/delete"
									formData={{ id: row.id }}
								>
									<div class="tooltip" data-tip="Delete">
										<button class="btn btn-square btn-error" type="button" aria-label="delete">
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
