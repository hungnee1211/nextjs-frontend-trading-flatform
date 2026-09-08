'use client';

import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BuyWidgetProps {
  currentPrice: number;
}

export function BuyWidget({ currentPrice }: BuyWidgetProps) {
  const [buyAmount, setBuyAmount] = useState<string>('');

  return (
    <div className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#2b313a] rounded-2xl p-5 space-y-5 transition-colors duration-200">
      <div className="flex border-b border-gray-200 dark:border-[#2b313a] pb-3 space-x-6 text-base font-bold">
        <span className="text-gray-900 dark:text-white border-b-2 border-[#F0B90B] pb-3 cursor-pointer">Mua BTC</span>
        <span className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer">Giao dịch BTC</span>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 dark:bg-[#2b313a]/50 border border-gray-200 dark:border-[#2b313a] rounded-xl p-3.5 space-y-1 transition-colors">
          <span className="text-xs text-gray-400 dark:text-gray-500">Bạn mua</span>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" alt="BTC" className="w-5 h-5" />
              <span className="font-bold text-gray-900 dark:text-white text-sm">BTC</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500 font-semibold text-lg">
              {buyAmount ? (Number(buyAmount) / currentPrice).toFixed(6) : '0'}
            </span>
          </div>
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-[#2b313a] dark:bg-[#2b313a] p-1.5 rounded-lg border border-[#1e2329] dark:border-[#1e2329] text-gray-300 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
            <ArrowUpDown className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#2b313a]/50 border border-gray-200 dark:border-[#2b313a] rounded-xl p-3.5 space-y-1 transition-colors">
          <span className="text-xs text-gray-400 dark:text-gray-500">Bạn sử dụng</span>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-[#F0B90B] font-black text-sm">$</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm">USD</span>
            </div>
            <Input
              type="number"
              placeholder="10 - 50.000"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="bg-transparent border-none text-right text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 p-0 h-auto transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 pt-1">
        <span>Tỷ giá</span>
        <span className="text-gray-600 dark:text-gray-300">1 BTC ≈ USD {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>

      <Button className="w-full bg-[#F0B90B] hover:bg-[#d9a608] text-black font-bold h-12 rounded-xl text-sm">
        Mua BTC
      </Button>
    </div>
  );
}