// ===== Flower Type Definition =====
export interface iFlower {
	id: string;
	name: string; // 中文名
	nameEn: string; // 英文名
	number: number; // 編號 01-12
	tagline: string; // 核心標語
	description: string; // 詳細描述
	flowerLanguage: string; // 花語
	mbtiTypes: string[]; // MBTI 對應類型
	mbtiExplanation: string; // MBTI 詳細說明
	quote: string; // 核心引言
	traits: string[]; // 性格特徵 tags
	color: string; // 主色調 (Hex)
	svgIcon?: React.ReactNode; // SVG 圖示
	backgroundImage?: string; // 背景圖片 URL（可選）
}

export interface iFlowerCarouselProps {
	items: React.ReactElement<{
		flower: iFlower;
		index: number;
		layout?: boolean;
		onCardClose: () => void;
	}>[];
	initialScroll?: number;
}
