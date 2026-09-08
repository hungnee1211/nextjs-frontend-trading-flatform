'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartHeaderProps {
  currentPrice: number;
  priceChange: number;
  timeframe: string;
}

export function ChartHeader({ currentPrice, priceChange, timeframe }: ChartHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Trang chủ</span>
        <span>›</span>
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Giá tiền mã hóa</span>
        <span>›</span>
        <span className="text-gray-700 dark:text-gray-200">Giá Bitcoin (BTC)</span>
      </div>

      {/* Main Price Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">Giá Bitcoin (BTC)</div>
          <div className="flex items-center space-x-3 mt-1">
            <img
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              alt="BTC"
              className="w-8 h-8"
            />
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} US$
            </span>
          </div>
          <div className={`text-xs font-semibold mt-1 ${priceChange >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% trong {timeframe === '1' ? '24 giờ qua' : 'khoảng thời gian này'}
          </div>
        </div>

        <Button variant="outline" className="bg-[#2b313a] dark:bg-[#2b313a] border-none text-white hover:bg-[#363c4e] dark:hover:bg-[#363c4e] text-xs h-8 px-3">
          <Share2 className="w-3.5 h-3.5 mr-1.5" /> Chia sẻ
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 dark:border-[#2b313a]/50 text-sm font-semibold pt-2">
        <span className="bg-[#2b313a] dark:bg-[#2b313a] text-white px-4 py-2 rounded-t-md cursor-pointer">Biểu đồ</span>
        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white py-2 cursor-pointer">Phân tích</span>
        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white py-2 cursor-pointer">Tin tức</span>
        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white py-2 cursor-pointer">Câu hỏi thường gặp</span>
        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white py-2 cursor-pointer">Tiền mã hóa nổi bật</span>
        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white py-2 cursor-pointer">Cặp giao dịch</span>
      </div>
    </div>
  );
}