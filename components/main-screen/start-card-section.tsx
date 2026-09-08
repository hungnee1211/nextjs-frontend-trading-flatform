import React from 'react';
import { CoinData } from '@/types/crypto';
import { StatCard } from './start-card';

interface StatCardsSectionProps {
  coins: CoinData[];
  formatCompact: (num: number) => string;
}

export function StatCardsSection({ coins, formatCompact }: StatCardsSectionProps) {
  if (!coins || coins.length === 0) {
    return null; // Tránh render khi chưa có dữ liệu
  }

  // 1. Phổ biến (Top 3 Market Cap)
  const popularCoins = coins.slice(0, 3);

  // 2. Top tăng giá
  const topGainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 3);

  // 3. Volume lớn nhất
  const topVolume = [...coins]
    .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
    .slice(0, 3);

  // 4. Mới Listing (Nếu coins ít hơn 13 phần tử thì tự lấy phần tử cuối mảng để không bị rỗng)
  const newListing = coins.length >= 13 ? coins.slice(10, 13) : coins.slice(-3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Phổ biến" coins={popularCoins} formatCompact={formatCompact} />
      <StatCard title="Mới" coins={newListing} formatCompact={formatCompact} />
      <StatCard title="Top tăng giá" coins={topGainers} formatCompact={formatCompact} />
      <StatCard title="Volume lớn nhất" coins={topVolume} formatCompact={formatCompact} />
    </div>
  );
}