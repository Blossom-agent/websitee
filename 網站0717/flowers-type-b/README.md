# 🌸 花型轉傳輪播組件 (Flower Carousel Component)

## 📋 概述

這是一個基於 Next.js + React 的花型轉傳輪播組件，用於展示 12 種花格人格。支持水平滑動、點擊展開全螢幕詳細介紹、鍵盤導航等功能。

## 📁 目錄結構

```
flowers-type-b/
├── types/
│   └── flowers.ts              # TypeScript 類型定義
├── data/
│   └── flowersData.ts          # 12 種花型的完整數據
├── components/
│   ├── FlowerCarousel.tsx      # 轉傳輪播容器
│   └── FlowerCard.tsx          # 單個花型卡片
├── app/
│   └── flowers/
│       └── page.tsx            # 示例頁面
└── README.md                   # 本文件
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install framer-motion lucide-react next-image
# 或
yarn add framer-motion lucide-react next-image
```

### 2. 環境設置

確保您的 `tsconfig.json` 包含路徑別名：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. 導入組件

```tsx
import { FlowerCarousel } from "@/components/FlowerCarousel";
import { FlowerCard } from "@/components/FlowerCard";
import { flowersData } from "@/data/flowersData";

export default function Page() {
  const flowerCards = flowersData.map((flower, index) => (
    <FlowerCard
      key={flower.id}
      flower={flower}
      index={index}
      layout={true}
    />
  ));

  return <FlowerCarousel items={flowerCards} />;
}
```

## 📦 主要組件

### `FlowerCarousel`

**水平滑動轉傳輪播容器**

```tsx
interface iFlowerCarouselProps {
  items: React.ReactElement[];  // 卡片列表
  initialScroll?: number;        // 初始滾動位置
}
```

**特性：**
- ✅ 流暢的水平滑動
- ✅ 左右導航按鈕
- ✅ 自動檢測是否可滑動
- ✅ 響應式設計
- ✅ 自動漸變遮罩

### `FlowerCard`

**單個花型卡片**

```tsx
interface FlowerCardProps {
  flower: iFlower;          // 花型數據
  index: number;            // 卡片索引
  layout?: boolean;         // 是否啟用 Framer Motion layout
  onCardClose?: () => void; // 卡片關閉回調
  backgroundImage?: string; // 背景圖片 URL
}
```

**特性：**
- ✅ 點擊展開全螢幕詳細介紹
- ✅ 支持 Escape 鍵關閉
- ✅ 點擊外部自動關閉
- ✅ 展開時禁用身體滾動
- ✅ Framer Motion 動畫過渡
- ✅ 懸停效果（3D 旋轉、縮放）

## 🎨 數據結構

### `iFlower` 類型定義

```tsx
interface iFlower {
  id: string;                    // 唯一識別碼
  name: string;                  // 中文名稱
  nameEn: string;                // 英文名稱
  number: number;                // 編號 (1-12)
  tagline: string;               // 核心標語
  description: string;           // 詳細描述
  flowerLanguage: string;        // 花語
  mbtiTypes: string[];           // MBTI 類型陣列
  mbtiExplanation: string;       // MBTI 詳細說明
  quote: string;                 // 核心引言
  traits: string[];              // 性格特徵標籤
  color: string;                 // 主色調 (Hex)
  svgIcon?: React.ReactNode;     // SVG 圖示（可選）
  backgroundImage?: string;      // 背景圖片 URL（可選）
}
```

### 花型數據範例

```tsx
{
  id: "rose",
  name: "紅玫瑰",
  nameEn: "Red Rose",
  number: 1,
  tagline: "妳不是等待被看見的人，妳本身就是焦點。",
  description: "紅玫瑰型的人熱情、直接...",
  flowerLanguage: "熱烈的愛、自信魅力、主動追求。",
  mbtiTypes: ["ENFJ", "ESTP"],
  mbtiExplanation: "擅長用外放能量帶動關係...",
  quote: "像是走進房間後，不需要開口也會被注意到的人。",
  traits: ["熱情", "魅力", "主動", "存在感"],
  color: "#c0454b"
}
```

## 🎯 使用案例

### 基礎用法

```tsx
import { FlowerCarousel } from "@/components/FlowerCarousel";
import { FlowerCard } from "@/components/FlowerCard";
import { flowersData } from "@/data/flowersData";

export default function FlowersShowcase() {
  return (
    <FlowerCarousel
      items={flowersData.map((flower, idx) => (
        <FlowerCard key={flower.id} flower={flower} index={idx} />
      ))}
    />
  );
}
```

### 自定義背景圖片

```tsx
<FlowerCard
  flower={flower}
  index={0}
  backgroundImage="https://example.com/bg.jpg"
/>
```

### 啟用 Layout Animation

```tsx
<FlowerCard
  flower={flower}
  index={0}
  layout={true}  // 啟用共享 layout ID
/>
```

## 🎮 交互功能

| 功能 | 操作 |
|------|------|
| 向左滑動 | 點擊左箭頭按鈕 |
| 向右滑動 | 點擊右箭頭按鈕 |
| 展開詳細 | 點擊卡片 |
| 關閉展開 | 按 Escape 或點擊外部 |
| 預防滾動 | 展開時自動禁用身體滾動 |

## 🎨 樣式定制

### 顏色主題

卡片使用花型的 `color` 屬性進行樣式化：

```tsx
// 在 FlowerCard 中
<div
  style={{
    borderTop: `4px solid ${flower.color}`,
  }}
>
```

### Tailwind 配置

確保您的 `tailwind.config.ts` 支持自定義顏色：

```ts
export default {
  theme: {
    extend: {
      fontFamily: {
        tiemposHeadline: ["Tiempos Headline", "serif"],
      },
    },
  },
};
```

## 📱 響應式設計

| 裝置 | 卡片寬度 | 卡片高度 | 間距 |
|------|---------|---------|------|
| 手機 | 320px | 500px | 4px |
| 平板 | 384px | 550px | 8px |
| 桌面 | 384px | 550px | 8px |

## ♿ 無障礙性（Accessibility）

- ✅ ARIA 標籤（`aria-label`）
- ✅ 語義化 HTML (`<button>`, `<article>`)
- ✅ 鍵盤導航（Escape 鍵關閉）
- ✅ 焦點管理
- ✅ 符合 WCAG 2.1 標準

## 🔧 環境變數

無需額外環境變數配置。

## 🐛 常見問題

### Q: 圖片如何優化？
**A:** 使用 Next.js 的 `Image` 組件自動優化，支持 WebP、AVIF 等現代格式。

### Q: 如何添加更多花型？
**A:** 在 `flowersData.ts` 中添加新的 `iFlower` 對象到陣列中。

### Q: 能否自定義動畫時序？
**A:** 可以修改 `FlowerCard.tsx` 中的 `motion.div` 的 `transition` 屬性。

### Q: 是否支持觸摸設備？
**A:** 是的，支持觸摸滑動，使用 `overscroll-x-auto` 實現。

## 📚 相關文件

- [Framer Motion 文檔](https://www.framer.com/motion/)
- [Next.js Image 優化](https://nextjs.org/docs/basic-features/image-optimization)
- [Lucide React 圖標](https://lucide.dev/)

## 📄 License

© 2024 繁花 BLOSSOM AGENT. All rights reserved.

---

### 版本信息

- **組件版本**: 1.0.0
- **Next.js**: 14.0+
- **React**: 18.0+
- **TypeScript**: 5.0+

### 維護者

如有問題或建議，歡迎提出反饋！
