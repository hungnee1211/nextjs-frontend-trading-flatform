'use client';

import React from 'react';
import { CoinData } from '@/types/crypto';

interface TradingDataSectionProps {
  coins: CoinData[];
  loading: boolean;
}

export const TradingDataSection: React.FC<TradingDataSectionProps> = ({
  coins,
  loading,
}) => {
  if (loading) {
    return <div className="text-center py-20 text-gray-400 dark:text-gray-500">Đang tải dữ liệu...</div>;
  }

  // --- DỮ LIỆU CỦA ROW 1 ---
  // 1. Coin nổi bật
  const hotCoins = coins.slice(0, 8);

  // 2. Top tăng giá
  const gainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 8);

  // 3. Top giảm giá
  const losers = [...coins]
    .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
    .slice(0, 8);

  // --- DỮ LIỆU CỦA ROW 2 (3 BẢNG MỚI) ---
  // 4. Khối lượng giao dịch nhiều nhất (24h Volume)
  const topVolume = [...coins]
    .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
    .slice(0, 10);

  // 5. Hợp đồng tương lai USD (Mô phỏng tên Futures USDT)
  const usdFutures = gainers.map((coin) => ({
    ...coin,
    futuresSymbol: `${coin.symbol.toUpperCase()}USDT Vĩnh Cửu`,
  }));

  // 6. Hợp đồng tương lai Coin (Mô phỏng tên Futures Coin-M)
  const coinFutures = gainers.map((coin) => ({
    ...coin,
    futuresSymbol: `${coin.symbol.toUpperCase()}USD CM Vĩnh Cửu`,
  }));

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  // Card dạng Chuẩn (Spot)
  const renderSpotCard = (title: string, list: CoinData[]) => (
    <div className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#2b313a] rounded-xl p-4 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-900 dark:text-white font-bold text-base">{title}</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#2b313a] px-2 py-1 rounded cursor-pointer">
          Crypto ▾
        </span>
      </div>

      <div className="grid grid-cols-12 text-xs text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-200 dark:border-[#2b313a] pb-2">
        <span className="col-span-6">Tên</span>
        <span className="col-span-3 text-right">Giá</span>
        <span className="col-span-3 text-right">Biến động 24h</span>
      </div>

      <div className="space-y-3">
        {list.map((item, index) => {
          const change = item.price_change_percentage_24h || 0;
          const isPositive = change >= 0;
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center text-xs md:text-sm hover:bg-gray-50 dark:hover:bg-[#2b313a]/40 p-1 rounded transition-colors"
            >
              <div className="col-span-6 flex items-center space-x-2 overflow-hidden">
                <span className="text-gray-400 dark:text-gray-500 w-4 text-xs">{index + 1}</span>
                <img src={item.image} alt={item.name} className="w-4 h-4 md:w-5 md:h-5 rounded-full" />
                <span className="text-gray-900 dark:text-white font-semibold uppercase truncate">{item.symbol}</span>
              </div>
              <div className="col-span-3 text-right text-gray-900 dark:text-white font-medium">
                {formatPrice(item.current_price)}
              </div>
              <div
                className={`col-span-3 text-right font-semibold ${
                  isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'
                }`}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Card dạng Hợp đồng tương lai (Futures)
  const renderFuturesCard = (title: string, list: Array<CoinData & { futuresSymbol: string }>) => (
    <div className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#2b313a] rounded-xl p-4 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-900 dark:text-white font-bold text-base">{title}</h3>
      </div>

      <div className="grid grid-cols-12 text-xs text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-200 dark:border-[#2b313a] pb-2">
        <span className="col-span-6">Tên</span>
        <span className="col-span-3 text-right">Giá</span>
        <span className="col-span-3 text-right">Thay đổi</span>
      </div>

      <div className="space-y-3">
        {list.map((item, index) => {
          const change = item.price_change_percentage_24h || 0;
          const isPositive = change >= 0;
          return (
            <div
              key={item.id + index}
              className="grid grid-cols-12 items-center text-xs md:text-sm hover:bg-gray-50 dark:hover:bg-[#2b313a]/40 p-1 rounded transition-colors"
            >
              <div className="col-span-6 flex items-center space-x-2 overflow-hidden">
                <span className="text-gray-400 dark:text-gray-500 w-4 text-xs">{index + 1}</span>
                <span className="text-gray-900 dark:text-white font-medium truncate" title={item.futuresSymbol}>
                  {item.futuresSymbol}
                </span>
              </div>
              <div className="col-span-3 text-right text-gray-900 dark:text-white font-medium">
                {item.current_price >= 1 ? item.current_price.toFixed(3) : item.current_price.toFixed(5)}
              </div>
              <div
                className={`col-span-3 text-right font-semibold ${
                  isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'
                }`}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Sub Tabs */}
      <div className="flex space-x-6 text-xs text-gray-400 dark:text-gray-500">
        <span className="text-gray-900 dark:text-white font-bold border-b-2 border-gray-900 dark:border-white pb-1 cursor-pointer">
          Thứ hạng
        </span>
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Hợp đồng tương lai USDⓈ-M</span>
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Hợp đồng tương lai COIN-M</span>
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Quyền chọn</span>
      </div>

      {/* Row 1: Coin nổi bật | Top tăng giá | Top giảm giá */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSpotCard('Coin nổi bật', hotCoins)}
        {renderSpotCard('Top tăng giá', gainers)}
        {renderSpotCard('Top giảm giá', losers)}
      </div>

      {/* Row 2: Khối lượng giao dịch nhiều nhất | Hợp đồng tương lai USD | Hợp đồng tương lai Coin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSpotCard('Khối lượng giao dịch nhiều nhất', topVolume)}
        {renderFuturesCard('Hợp đồng tương lai USD', usdFutures)}
        {renderFuturesCard('Hợp đồng tương lai Coin', coinFutures)}
      </div>
    </div>
  );
};