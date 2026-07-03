/**
 * cn() 是一個用于合并 Tailwind CSS 类名的工具函数
 * 用于条件性地应用 CSS 类，并处理类名冲突
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
