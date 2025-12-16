import { z } from 'zod';

export const shopConnectGHNSchema = z.object({
	ghnToken: z.string().trim().min(1, 'Vui lòng nhập api token GHN'),
	ghnShopId: z.string().trim().min(1, 'Vui lòng nhập ID cửa hàng trong trang quản trị GHN')
});

export type ShopConnectGHNSchema = z.infer<typeof shopConnectGHNSchema>;
