<script lang="ts">
	import {
		getAddressDistricts,
		getAddressProvinces,
		getAddressWards
	} from '$lib/remotes/shopAddress.remote';
	import FormInput from '../FormInput.svelte';
	import FormSelect from '../FormSelect.svelte';
	import LoadingPlaceholder from '../skeleton/LoadingPlaceholder.svelte';

	let { form, errors } = $props();
</script>

{#await getAddressProvinces()}
	<LoadingPlaceholder class="h-20" text="Đang tải danh sách tỉnh / thành phố..." />
{:then provinces}
	<FormSelect
		name="provinceId"
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
				(province) => province.ProvinceID === Number($form.provinceId)
			);
			$form.provinceId = selectedProvince ? selectedProvince.ProvinceID : '';
			$form.provinceName = selectedProvince ? selectedProvince.ProvinceName : '';
			$form.districtId = '';
			$form.districtName = '';
			$form.wardCode = '';
			$form.wardName = '';
		}}
		{errors}
	/>
	<FormInput
		name="provinceName"
		label="Tên tỉnh / thành phố"
		placeholder="Nhập tên tỉnh / thành phố ẩn..."
		type="text"
		superForm={form}
		{errors}
		hidden
		hideError
	/>
{/await}

{#await getAddressDistricts($form.provinceId)}
	<LoadingPlaceholder class="h-20" text="Đang tải danh sách quận / huyện..." />
{:then districts}
	{#if districts && $form.provinceId}
		<FormSelect
			name="districtId"
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
					(district) => district.DistrictID === Number($form.districtId)
				);
				$form.districtId = selectedDistrict ? selectedDistrict.DistrictID : '';
				$form.districtName = selectedDistrict ? selectedDistrict.DistrictName : '';
				$form.wardCode = '';
				$form.wardName = '';
			}}
			{errors}
		/>
		<FormInput
			name="districtName"
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

{#await getAddressWards($form.districtId)}
	<LoadingPlaceholder class="h-20" text="Đang tải danh sách phường / xã..." />
{:then wards}
	{#if wards && $form.districtId}
		<FormSelect
			name="wardCode"
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

				const selectedWard = wards.find((ward) => ward.WardCode === $form.wardCode);
				$form.wardName = selectedWard ? selectedWard.WardName : '';
				$form.wardCode = selectedWard ? selectedWard.WardCode : '';
			}}
			{errors}
		/>
		<FormInput
			name="wardName"
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
