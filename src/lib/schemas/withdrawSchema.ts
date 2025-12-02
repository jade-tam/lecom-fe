import { z } from 'zod';

export const createWithdrawSchema = z.object({
    amount: z.number("Nhập số tiền").min(100000, 'Số tiền rút tối thiểu là 100.000₫'),
    bankName: z.string().min(2, 'Tên ngân hàng không được để trống'),
    bankAccountNumber: z
        .string()
        .min(6, 'Số tài khoản phải có ít nhất 6 ký tự')
        .max(20, 'Số tài khoản tối đa 20 ký tự')
        .regex(/^\d+$/, 'Số tài khoản chỉ được chứa số'),
    bankAccountName: z.string().min(2, 'Tên chủ tài khoản không được để trống'),
    bankBranch: z.string().min(2, 'Chi nhánh ngân hàng không được để trống'),
    note: z.string().max(100, 'Ghi chú tối đa 100 ký tự').optional()
});

export type CreateWithdrawSchema = z.infer<typeof createWithdrawSchema>;
