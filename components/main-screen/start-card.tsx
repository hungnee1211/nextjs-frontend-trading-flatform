import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CoinData } from '@/types/crypto';

interface StatCardProps {
  title: string;
  coins: CoinData[];
  formatCompact: (num: number) => string;
}

export function StatCard({ title, coins, formatCompact }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1e2329] rounded-xl p-4 border border-gray-200 dark:border-[#2b313a]/50 transition-colors duration-200">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-900 dark:text-white font-semibold text-xs">{title}</span>
        <a href="#" className="text-gray-400 dark:text-gray-500 text-[11px] hover:text-[#F0B90B] flex items-center">
          Nhiều hơn <ChevronRight className="w-3 h-3 ml-0.5" />
        </a>
      </div>
      <div className="space-y-3">
        {coins.map((coin) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div key={coin.id} className="flex items-center justify-between text-xs hover:bg-gray-50 dark:hover:bg-[#2b313a]/30 p-1 rounded transition-colors">
              <div className="flex items-center space-x-2.5">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                <span className="font-bold text-gray-900 dark:text-white uppercase">{coin.symbol}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900 dark:text-white">{formatCompact(coin.current_price)}</span>
                <span className={`font-medium min-w-[55px] text-right ${isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                  {isPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}