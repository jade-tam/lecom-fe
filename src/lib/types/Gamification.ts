import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export type GamificationProfile = {
	level: number;
	currentXP: number;
	xpToNextLevel: number;
	coins: number;
	boosters: {
		isXPBoostActive: number;
		xPBoostActiveUntil: string; // ISO date string
		streakShieldCount: number; // Số lượng khiên bảo vệ chuỗi ngày đang có
	};
	dailyStreak: number;
	isStreakShieldRecentlyUsed: boolean; // Đánh dấu xem hôm qua có vừa dùng khiên bảo vệ chuỗi ngày không
	dailyQuests: Quest[];
	weeklyQuests: Quest[];
	monthlyQuests: Quest[];
	recentlyCompletedAchievements: Achievement[]; // Danh sách 4 thành tựu vừa hoàn thành gần đây
};

export type Quest = {
	id: string;
	title: string;
	description: string;
	currentCount: number;
	targetCount: number;
	xpReward: number;
	coinReward: number;
	isCompleted: boolean;
	isRewardClaimed: boolean;
	deadline: string;
};

export type RewardStoreItemType = {
	id: string;
	type: 'Booster' | 'Voucher';
	title: string; // e.g., "Double XP Boost"
	description: string; // e.g., "Doubles the XP you earn for a limited time."
	durationDescription: string; // e.g., "Active for 24 hours" || "single-use"
	coinCost: number;
	imageUrl: string;
	redeemable: boolean; // Be tự set nút "đổi thưởng" có thể nhấn được hay không tuỳ trường hợp
	rewardCode: string; // Mã dùng để redeem phần thưởng, ví dụ: "DOUBLE_XP_24H"
};

export type Achievement = {
	id: string;
	category: 'learning' | 'shopping' | 'social' | 'special';
	imageUrl: string;
	title: string;
	description: string;
	currentCount: number;
	targetCount: number;
	xpReward: number;
	coinReward: number;
	isCompleted: boolean;
	isRewardClaimed: boolean;
	completedAt?: string; // ISO date string - ngày hoàn thành
};

export type ApiGamificationRewards = {
	boosters: RewardStoreItemType[];
	vouchers: RewardStoreItemType[];
}; // /api/gamification/rewards trả về kiểu này

export type ApiUserAchivements = {
	categories: {
		value: string;
		title: string;
	}[]; // danh sách categories, ví dụ: [{ value: 'learning', title: 'Học tập' }, ...]
	achievements: Achievement[];
}; // api lấy danh sách achievements của ng dùng  (hiện tại chưa có) trả về kiểu này

export type RedeemRule = {
	id: string;
	reward: string;
	costPoints: number;
	active: boolean;
};
