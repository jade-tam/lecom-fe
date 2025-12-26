export type PlatformConfigFull = {
	id: string;

	defaultCommissionRate: number; // %
	orderHoldingDays: number; // days
	minWithdrawalAmount: number; // VND
	maxWithdrawalAmount: number; // VND

	autoApproveWithdrawal: boolean;
	maxRefundDays: number;
	autoApproveRefund: boolean;

	payOSEnvironment: string;
	payOSClientId: string;
	payOSApiKey: string;
	payOSChecksumKey: string;

	enableEmailNotification: boolean;
	enableSMSNotification: boolean;

	lastUpdated: string; // ISO UTC string
	lastUpdatedBy: string; // UUID
};
