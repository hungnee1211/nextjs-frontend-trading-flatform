'use client';

import React from 'react';

interface PriceTickerProps {
  symbol: string;
  tickerData: { lastPrice: string; priceChangePercent: string; volume: string } | null;
}

export function PriceTicker({ symbol, tickerData }: PriceTickerProps) {
  const priceChangePercent = tickerData ? parseFloat(tickerData.priceChangePercent) : 0;
  const isPositive = priceChangePercent >= 0;
  const color = isPositive ? '#0ecb81' : '#f6465d';

  return (
    <div className="px-5 py-2 border-b border-[#2b313a] flex gap-6 items-center bg-[#181a20]">
      <h2 className="text-base flex items-center gap-1.5">
        <span className="font-bold">{symbol}</span>
        <span className="text-xs text-gray-500 font-normal">Spot</span>
      </h2>

      <div>
        <div className="text-[10px] text-gray-500">Giá gần nhất</div>
        <div className="text-sm font-bold" style={{ color }}>
          ${tickerData ? parseFloat(tickerData.lastPrice).toLocaleString() : '--'}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-gray-500">Biến động 24h</div>
        <div className="text-sm" style={{ color }}>
          {tickerData ? `${isPositive ? '+' : ''}${parseFloat(tickerData.priceChangePercent).toFixed(2)}%` : '--'}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-gray-500">Khối lượng 24h</div>
        <div className="text-sm">{tickerData ? parseFloat(tickerData.volume).toLocaleString() : '--'}</div>
      </div>
    </div>
  );
}