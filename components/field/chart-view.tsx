'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { CoinData } from '@/types/crypto';

interface ChartViewProps {
  selectedCoin?: CoinData | null;
  timeframe: string;
  setTimeframe: (val: string) => void;
  chartData: { time: string; price: number }[];
  loading: boolean;
}

export function ChartView({
  selectedCoin,
  timeframe,
  setTimeframe,
  chartData,
  loading,
}: ChartViewProps) {
  const prices = chartData.map((d) => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;

  // Tự động format trục Y linh hoạt theo mức giá của Coin được chọn
  const formatYAxis = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  return (
    <div className="space-y-4">
      {/* Chart Header: Hiển thị Coin đang chọn & Timeframe */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {selectedCoin && (
            <>
              <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />
              <span className="text-white dark:text-white font-bold text-sm uppercase">{selectedCoin.symbol}/USD</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">({selectedCoin.name})</span>
            </>
          )}
        </div>

        {/* Timeframe Selectors */}
        <div className="flex items-center space-x-1 text-xs">
          {[
            { label: '1 ngày', value: '1' },
            { label: '7 ngày', value: '7' },
            { label: '1 tháng', value: '30' },
            { label: '3 tháng', value: '90' },
            { label: '1 năm', value: '365' },
          ].map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1.5 rounded transition-colors font-medium ${
                timeframe === tf.value
                  ? 'bg-[#2b313a] dark:bg-[#2b313a] text-white'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2b313a]/40'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[400px] w-full bg-[#181a20] dark:bg-[#181a20] relative pt-4 rounded-xl p-2">
        <span className="absolute top-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 font-bold">USD</span>
        {loading ? (
          <div className="h-full flex justify-center items-center text-xs text-gray-400 dark:text-gray-500">
            Đang tải dữ liệu biểu đồ cho {selectedCoin?.symbol?.toUpperCase() || 'Coin'}...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex justify-center items-center text-xs text-gray-400 dark:text-gray-500">
            Không có dữ liệu biểu đồ
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F0B90B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis
                domain={[minPrice * 0.995, maxPrice * 1.005]}
                orientation="left"
                tick={{ fill: '#848e9c', fontSize: 11 }}
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2329',
                  borderColor: '#2b313a',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Giá']}
                labelStyle={{ color: '#848e9c' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#F0B90B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}