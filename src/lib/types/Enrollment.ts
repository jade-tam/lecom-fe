export type Enrollment = {
	id: string;
	userId: string;
	courseId: string;
	courseTitle: string;
	courseSlug: string;
	progress: number;
	enrolledAt: string;
	completedAt: string | null;
	shopName: string;
	categoryName: string;
	courseThumbnail: string;
};
