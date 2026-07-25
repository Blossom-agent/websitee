"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { iFlower } from "@/types/flowers";

// ===== Custom Hooks =====
const useOutsideClick = (
	ref: React.RefObject<HTMLDivElement | null>,
	onOutsideClick: () => void,
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			onOutsideClick();
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [ref, onOutsideClick]);
};

// ===== Components =====
/**
 * 花型卡片組件
 * 支持點擊展開全螢幕詳細介紹
 * 支持 Escape 鍵關閉、點擊外部關閉
 */
const FlowerCard = ({
	flower,
	index,
	layout = false,
	onCardClose = () => {},
	backgroundImage,
}: {
	flower: iFlower;
	index: number;
	layout?: boolean;
	onCardClose?: () => void;
	backgroundImage?: string;
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleExpand = () => {
		return setIsExpanded(true);
	};

	const handleCollapse = () => {
		setIsExpanded(false);
		onCardClose();
	};

	// 處理展開/收起時的滾動鎖定
	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleCollapse();
			}
		};

		if (isExpanded) {
			const scrollY = window.scrollY;
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
			document.body.dataset.scrollY = scrollY.toString();
		} else {
			const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			window.scrollTo({ top: scrollY, behavior: "instant" });
		}

		window.addEventListener("keydown", handleEscapeKey);
		return () => {
			return window.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isExpanded]);

	useOutsideClick(containerRef, handleCollapse);

	return (
		<>
			<AnimatePresence>
				{isExpanded && (
					<div className="fixed inset-0 h-screen overflow-hidden z-50">
						{/* 背景模糊層 */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="bg-black/40 backdrop-blur-lg h-full w-full fixed inset-0"
						/>

						{/* 展開卡片 */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							ref={containerRef}
							layoutId={layout ? `card-${flower.id}` : undefined}
							className="max-w-5xl mx-auto bg-gradient-to-b from-[#f2f0eb] to-[#fff9eb] h-full z-[60] p-4 md:p-10 rounded-3xl relative md:mt-10 overflow-y-auto"
						>
							{/* 關閉按鈕 */}
							<button
								className="sticky top-4 h-8 w-8 right-0 ml-auto rounded-full flex items-center justify-center bg-[#4b3f33] hover:bg-[#3a2f26] transition-colors z-10"
								onClick={handleCollapse}
								aria-label="關閉"
							>
								<X className="h-6 w-6 text-white" />
							</button>

							{/* 內容 */}
							<div className="px-0 md:px-20 space-y-4">
								{/* 編號和英文名 */}
								<motion.div
									layoutId={layout ? `header-${flower.id}` : undefined}
									className="flex items-baseline gap-4"
								>
									<span className="text-3xl font-bold text-[#4b3f33]">
										{String(flower.number).padStart(2, "0")}
									</span>
									<p className="text-lg text-[rgba(31,27,29,0.7)] font-tiemposHeadline underline underline-offset-8">
										{flower.nameEn}
									</p>
								</motion.div>

								{/* 花型名稱 */}
								<motion.p
									layoutId={layout ? `title-${flower.id}` : undefined}
									className="text-2xl md:text-4xl font-normal italic text-[rgba(31,27,29,0.7)] font-tiemposHeadline lowercase"
								>
									{flower.name}
								</motion.p>

								{/* 核心標語 */}
								<p className="text-xl text-[#4b3f33] font-semibold">
									{flower.tagline}
								</p>

								{/* 詳細描述 */}
								<p className="text-lg text-[rgba(31,27,29,0.8)] leading-relaxed">
									{flower.description}
								</p>

								{/* 特徵標籤 */}
								<div className="flex flex-wrap gap-2 py-4">
									{flower.traits.map((trait) => (
										<span
											key={trait}
											className="px-4 py-2 rounded-full bg-[#4b3f33]/10 text-[#4b3f33] text-sm font-medium"
										>
											{trait}
										</span>
									))}
								</div>

								{/* 花語 */}
								<div className="bg-[#f2e8d6] p-6 rounded-2xl">
									<p className="font-semibold text-[#4b3f33] mb-2">
										花語
									</p>
									<p className="text-[rgba(31,27,29,0.8)]">
										{flower.flowerLanguage}
									</p>
								</div>

								{/* MBTI 對應 */}
								<div className="bg-[#f2e8d6] p-6 rounded-2xl">
									<p className="font-semibold text-[#4b3f33] mb-2">
										MBTI 對應
									</p>
									<p className="text-lg font-bold text-[#c0454b] mb-2">
										{flower.mbtiTypes.join(" / ")}
									</p>
									<p className="text-[rgba(31,27,29,0.8)]">
										{flower.mbtiExplanation}
									</p>
								</div>

								{/* 核心引言 */}
								<div className="bg-gradient-to-r from-[#f2f0eb] to-[#fff9eb] p-6 rounded-2xl border-l-4 border-[#4b3f33]">
									<div className="flex items-start gap-3">
										<Quote className="h-6 w-6 text-[#4b3f33] flex-shrink-0 mt-1" />
										<p className="italic text-lg text-[rgba(31,27,29,0.8)]">
											"{flower.quote}"
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* 縮小卡片（預覽狀態） */}
			<motion.button
				layoutId={layout ? `card-${flower.id}` : undefined}
				onClick={handleExpand}
				className=""
				whileHover={{
					rotateX: 2,
					rotateY: 2,
					rotate: 3,
					scale: 1.02,
					transition: { duration: 0.3, ease: "easeOut" },
				}}
			>
				<div
					className="rounded-3xl bg-gradient-to-b from-[#f2f0eb] to-[#fff9eb] h-[500px] md:h-[550px] w-80 md:w-96 overflow-hidden flex flex-col items-center justify-center relative z-10 shadow-md hover:shadow-lg transition-shadow duration-300"
					style={{
						borderTop: `4px solid ${flower.color}`,
					}}
				>
					{/* 背景圖片層（可選） */}
					{backgroundImage && (
						<div className="absolute opacity-20" style={{ inset: "-1px 0 0" }}>
							<div className="absolute inset-0">
								<Image
									className="w-full h-full object-center object-cover"
									src={backgroundImage}
									alt="Background layer"
									fill
									objectFit="cover"
								/>
							</div>
						</div>
					)}

					{/* 花型編號 */}
					<div className="text-5xl font-bold text-[rgba(31,27,29,0.3)] absolute top-6 right-6">
						{String(flower.number).padStart(2, "0")}
					</div>

					{/* 花型名稱 */}
					<motion.p
						layoutId={layout ? `title-${flower.id}` : undefined}
						className="text-2xl md:text-2xl font-normal text-center font-tiemposHeadline mt-4 lowercase px-3 relative z-10"
						style={{ color: flower.color }}
					>
						{flower.name}
					</motion.p>

					{/* 核心標語 */}
					<motion.p
						layoutId={layout ? `tagline-${flower.id}` : undefined}
						className="text-[rgba(31,27,29,0.7)] text-lg md:text-lg font-semibold text-center [text-wrap:balance] font-tiemposHeadline mt-3 px-3 relative z-10 leading-snug"
					>
						{flower.tagline}
					</motion.p>

					{/* 特徵標籤 */}
					<div className="flex flex-wrap gap-2 justify-center mt-4 px-3 relative z-10">
						{flower.traits.slice(0, 2).map((trait) => (
							<span
								key={trait}
								className="px-3 py-1 rounded-full bg-[rgba(31,27,29,0.1)] text-[rgba(31,27,29,0.6)] text-xs font-medium"
							>
								{trait}
							</span>
						))}
					</div>

					{/* MBTI 標籤 */}
					<motion.p
						layoutId={layout ? `mbti-${flower.id}` : undefined}
						className="text-base md:text-base font-semibold font-tiemposHeadline text-center mt-3 lowercase underline underline-offset-4 decoration-1 relative z-10"
						style={{ color: flower.color }}
					>
						{flower.mbtiTypes.join(" / ")}
					</motion.p>
				</div>
			</motion.button>
		</>
	);
};

export { FlowerCard };
