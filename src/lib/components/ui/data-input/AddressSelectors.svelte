<script lang="ts">
	import {
		getAddressDistricts,
		getAddressProvinces,
		getAddressWards
	} from '$lib/remotes/shopAddress.remote';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import FormInput from '../FormInput.svelte';
	import FormSelect from '../FormSelect.svelte';
	import LoadingPlaceholder from '../skeleton/LoadingPlaceholder.svelte';

	let {
		form,
		errors,
		fieldNames = {
			provinceId: 'provinceId',
			provinceName: 'provinceName',
			districtId: 'districtId',
			districtName: 'districtName',
			wardCode: 'wardCode',
			wardName: 'wardName'
		}
	}: {
		form: SuperFormData<any>;
		errors: SuperFormErrors<any>;
		fieldNames?: {
			provinceId: string;
			provinceName: string;
			districtId: string;
			districtName: string;
			wardCode: string;
			wardName: string;
		};
	} = $props();
</script>

{#await getAddressProvinces()}
	<LoadingPlaceholder class="h-20" text="Đang tải danh sách tỉnh / thành phố..." />
{:then provinces}
	<FormSelect
		isValueNumber
		name={fieldNames.provinceId}
		label="Tỉnh / Thành phố"
		placeholder="Chọn tỉnh / thành phố..."
		options={provinces
			? provinces.map((province) => ({
					title: province.ProvinceName,
					value: province.ProvinceID
				}))
			: []}
		superForm={form}
		onchange={() => {
			if (!provinces) return;

			const selectedProvince = provinces.find(
				(province) => province.ProvinceID === Number($form[fieldNames.provinceId])
			);
			$form[fieldNames.provinceName] = selectedProvince ? selectedProvince.ProvinceName : '';
			$form[fieldNames.districtId] = 0;
			$form[fieldNames.districtName] = '';
			$form[fieldNames.wardCode] = '';
			$form[fieldNames.wardName] = '';
		}}
		{errors}
	/>
	<FormInput
		name={fieldNames.provinceName}
		label="Tên tỉnh / thành phố"
		placeholder="Nhập tên tỉnh / thành phố ẩn..."
		type="text"
		superForm={form}
		{errors}
		hidden
		hideError
	/>
{/await}

{#await getAddressDistricts($form[fieldNames.provinceId])}
	<LoadingPlaceholder class="h-20" text="Đang tải danh sách quận / huyện..." />
{:then districts}
	{#if districts && $form[fieldNames.provinceId]}
		<FormSelect
			isValueNumber
			name={fieldNames.districtId}
			label="Quận / Huyện"
			placeholder="Chọn hoặc nhập quận / huyện..."
			options={districts
				? districts.map((district) => ({
						title: district.DistrictName,
						value: district.DistrictID
					}))
				: []}
			superForm={form}
			onchange={() => {
				if (!districts) return;

				const selectedDistrict = districts.find(
					(district) => district.DistrictID === Number($form[fieldNames.districtId])
				);
				$form[fieldNames.districtName] = selectedDistrict ? selectedDistrict.DistrictName : '';
				$form[fieldNames.wardCode] = '';
				$form[fieldNames.wardName] = '';
			}}
			{errors}
		/>
		<FormInput
			name={fieldNames.districtName}
			label="Tên quận / huyện"
			placeholder="Nhập tên quận / huyện ẩn..."
			type="text"
			superForm={form}
			{errors}
			hideError
			hidden
		/>
	{/if}
{/await}

{#await getAddressWards($form[fieldNames.districtId])}
	<LoadingPlaceholder class="h-20" text="Đang tải danh sách phường / xã..." />
{:then wards}
	{#if wards && $form[fieldNames.districtId]}
		<FormSelect
			name={fieldNames.wardCode}
			label="Phường / Xã"
			placeholder="Chọn hoặc nhập phường / xã..."
			options={wards
				? wards.map((ward) => ({
						title: ward.WardName,
						value: ward.WardCode
					}))
				: []}
			superForm={form}
			onchange={() => {
				if (!wards) return;

				const selectedWard = wards.find((ward) => ward.WardCode === $form[fieldNames.wardCode]);
				$form[fieldNames.wardName] = selectedWard ? selectedWard.WardName : '';
			}}
			{errors}
		/>
		<FormInput
			name={fieldNames.wardName}
			label="Tên phường / Xã"
			placeholder="Tên phường / xã..."
			type="text"
			superForm={form}
			{errors}
			hidden
			hideError
		/>
	{/if}
{/await}
