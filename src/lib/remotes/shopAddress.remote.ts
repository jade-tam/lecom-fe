import { getRequestEvent, query } from '$app/server';
import type {
	AddressDistrict,
	AddressProvince,
	AddressWard,
	GHNStatus,
	ShopAddress
} from '$lib/types/Shop';
import { fetchApi, fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';
import z from 'zod';

export const getShopAddress = query(async () => {
	const { cookies } = getRequestEvent();

	const shopAddress = await getSafeResult(
		fetchAuthorizedApi<ShopAddress>(cookies, `/api/shop/address/me`, 'GET'),
		null
	);

	return shopAddress;
});

export const getAddressProvinces = query(async () => {
	const provinces = await getSafeResult(
		fetchApi<AddressProvince[]>(`/api/shipping/provinces`, 'GET'),
		null
	);

	return provinces;
});

export const getAddressDistricts = query(z.number().optional(), async (provinceId) => {
	if (!provinceId) return [];

	const districts = await getSafeResult(
		fetchApi<AddressDistrict[]>(`/api/shipping/districts/${provinceId}`, 'GET'),
		null
	);

	return districts;
});

export const getAddressWards = query(z.number().optional(), async (districtId) => {
	if (!districtId) return [];

	const wards = await getSafeResult(
		fetchApi<AddressWard[]>(`/api/shipping/wards/${districtId}`, 'GET'),
		null
	);

	return wards;
});

export const getGHNStatus = query(async () => {
	const { cookies } = getRequestEvent();

	const status = await getSafeResult(
		fetchAuthorizedApi<GHNStatus>(cookies, `/api/shop/address/me/ghn/status`, 'GET'),
		null
	);

	return status;
});
