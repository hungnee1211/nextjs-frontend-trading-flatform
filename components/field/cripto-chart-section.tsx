'use client';

import React, { useEffect, useState } from 'react';
import { ChartHeader } from './chart-header';
import { ChartView } from './chart-view';
import { BuyWidget } from './buy-widget';

type TimeframeType = '1' | '7' | '30' | '90' | '365';

export function CryptoChartSection() {
  const [timeframe, setTimeframe] = useState<TimeframeType>('1');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPrice, setCurrentPrice] = useState<number>(78277.13);
  const [priceChange, setPriceChange] = useState<number>(8.81);

  // Function bọc để xử lý ép kiểu từ string sang TimeframeType
  const handleSetTimeframe = (val: string) => {
    setTimeframe(val as TimeframeType);
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${timeframe}`
        );
        const data = await res.json();

        if (data && data.prices) {
          const formattedData = data.prices.map(([time, price]: [number, number]) => {
            const date = new Date(time);
            return {
              timestamp: time,
              time: timeframe === '1' 
                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
              price: Number(price.toFixed(2)),
            };
          });

          setChartData(formattedData);

          if (formattedData.length > 0) {
            const latestPrice = formattedData[formattedData.length - 1].price;
            const firstPrice = formattedData[0].price;
            setCurrentPrice(latestPrice);
            setPriceChange(((latestPrice - firstPrice) / firstPrice) * 100);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeframe]);

  return (
    <div className="space-y-6">
      <ChartHeader
        currentPrice={currentPrice}
        priceChange={priceChange}
        timeframe={timeframe}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <ChartView
            timeframe={timeframe}
            setTimeframe={handleSetTimeframe} // Truyền function helper đã được xử lý
            chartData={chartData}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-4">
          <BuyWidget currentPrice={currentPrice} />
        </div>
      </div>
    </div>
  );
}