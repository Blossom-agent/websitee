import React from "react";
import { FlowerCarousel } from "@/components/FlowerCarousel";
import { FlowerCard } from "@/components/FlowerCard";
import { flowersData } from "@/data/flowersData";

/**
 * 花型轉傳輪播頁面示例
 * 展示 12 種花型，支持水平滑動和點擊展開
 */
export default function FlowersPage() {
	const flowerCards = flowersData.map((flower, index) => (
		<FlowerCard
			key={flower.id}
			flower={flower}
			index={index}
			layout={true}
		/>
	));

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#fbf5ef] via-[#f6ebe1] to-[#f3e3d3]">
			{/* 頁首 */}
			<header className="pt-20 pb-10 px-4 md:px-8 text-center">
				<p className="text-sm font-semibold text-[#a93538] tracking-widest uppercase mb-4">
					Flower Type Guide
				</p>
				<h1 className="text-4xl md:text-5xl font-bold text-[#3f3435] mb-6 font-tiemposHeadline">
					12 種花格人格
				</h1>
				<p className="max-w-2xl mx-auto text-lg text-[rgba(59,59,59,0.7)] leading-relaxed">
					每一種花格都不是單純的性格標籤，而是一種氣質入口：妳如何在人群中被看見、如何愛人、如何面對壓力，又如何保留自己的內在世界。
				</p>
			</header>

			{/* 描述 */}
			<section className="max-w-5xl mx-auto px-4 md:px-8 pb-12">
				<p className="text-center text-[rgba(59,59,59,0.6)] text-sm md:text-base">
					點擊卡片查看詳細介紹｜按左右箭頭滑動探索
				</p>
			</section>

			{/* 轉傳輪播 */}
			<section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
				<FlowerCarousel items={flowerCards} />
			</section>

			{/* 底部信息 */}
			<footer className="bg-[#2b1f1f] text-[#d8c5c1] py-12 text-center">
				<p className="text-lg font-tiemposHeadline mb-2">
					讓每一朵花，盛開成自己。
				</p>
				<p className="text-sm text-[#8a7572]">
					© {new Date().getFullYear()} 繁花 BLOSSOM AGENT. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
