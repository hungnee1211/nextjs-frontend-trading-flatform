import React from 'react';
import { ArrowUpDown, ChevronDown, BarChart2, Loader2 } from 'lucide-react';
import { CoinData } from '@/types/crypto';

interface CoinTableProps {
  coins: CoinData[];
  loading: boolean;
  formatCompact: (num: number) => string;
  onSelectCoin?: (coin: CoinData) => void; // Prop mới để truyền sự kiện chọn coin
  selectedCoinId?: string; // Tùy chọn: Highlight coin đang chọn
}

export function CoinTable({
  coins,
  loading,
  formatCompact,
  onSelectCoin,
  selectedCoinId,
}: CoinTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#F0B90B]" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">

      {coins.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          Không tìm thấy token nào phù hợp với từ khóa.
        </div>
      )}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 dark:text-gray-500 text-xs border-b border-gray-200 dark:border-[#2b313a] pb-2">
            <th className="py-3 font-normal cursor-pointer">
              <div className="flex items-center space-x-1">
                <span>Tên</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3 font-normal text-right cursor-pointer">
              <div className="flex items-center justify-end space-x-1">
                <span>Giá</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3 font-normal text-right cursor-pointer">
              <div className="flex items-center justify-end space-x-1">
                <span className="bg-[#2b313a] dark:bg-[#2b313a] text-white px-1.5 py-0.5 rounded text-[10px]">
                  24h <ChevronDown className="w-2.5 h-2.5 inline" />
                </span>
                <span>Thay đổi</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3 font-normal text-right cursor-pointer">
              <div className="flex items-center justify-end space-x-1">
                <span>KL 24h</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3 font-normal text-right cursor-pointer">
              <div className="flex items-center justify-end space-x-1">
                <span>Vốn hóa thị trường</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3 font-normal text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-[#2b313a]/40">
          {coins.map((coin) => {
            const isPositive = coin.price_change_percentage_24h >= 0;
            const isSelected = selectedCoinId === coin.id;

            return (
              <tr
                key={coin.id}
                onClick={() => onSelectCoin && onSelectCoin(coin)}
                className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2b313a]/80 dark:bg-[#2b313a]/80 border-l-2 border-[#F0B90B]'
                      : 'hover:bg-gray-50 dark:hover:bg-[#2b313a]/30'
                  }`}
              >
                <td className="py-4 pl-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex items-baseline space-x-1.5">
                      <span className="font-bold text-gray-900 dark:text-white text-sm uppercase">
                        {coin.symbol}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{coin.name}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    $
                    {coin.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500">
                    $
                    {coin.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </td>
                <td
                  className={`py-4 text-right font-medium ${isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'
                    }`}
                >
                  {isPositive ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="py-4 text-right font-medium text-gray-900 dark:text-white">
                  {formatCompact(coin.total_volume)}
                </td>
                <td className="py-4 text-right font-medium text-gray-900 dark:text-white">
                  {formatCompact(coin.market_cap)}
                </td>
                <td className="py-4 text-right pr-2">
                  <div className="flex items-center justify-end space-x-3 text-gray-400 dark:text-gray-500">
                    <BarChart2
                      className="w-4 h-4 hover:text-[#F0B90B] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Tránh bị double click
                        if (onSelectCoin) onSelectCoin(coin);
                      }}
                    />
                    <span className="hover:text-[#F0B90B] font-bold text-base cursor-pointer">
                      ⇄
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}