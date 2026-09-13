"use client";

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeries,
  Time,
} from 'lightweight-charts';

interface BinanceKlineStream {
  k: {
    t: number;
    o: string;
    h: string;
    l: string;
    c: string;
    x: boolean;
  };
}

interface FuturesChartContainerProps {
  symbol?: string;
}

export default function ChartContainer({ symbol = 'BTCUSDT' }: FuturesChartContainerProps) {
  const [timeframe, setTimeframe] = useState('1h');
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Map timeframe label -> Binance interval
  const intervalMap: Record<string, string> = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
  };

  // Khởi tạo chart 1 lần
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#12161c' },
        textColor: '#848e9c',
      },
      grid: {
        vertLines: { color: '#1e2329' },
        horzLines: { color: '#1e2329' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2b313a',
      },
      rightPriceScale: {
        borderColor: '#2b313a',
      },
    });

    chartInstanceRef.current = chart;

    candlestickSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: false,
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length || !chartContainerRef.current || !chartInstanceRef.current) return;
      const { width, height } = entries[0].contentRect;
      chartInstanceRef.current.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // Tải dữ liệu & kết nối WebSocket mỗi khi đổi symbol hoặc timeframe
  useEffect(() => {
    if (!candlestickSeriesRef.current) return;

    setIsLoading(true);
    
    // Đóng WebSocket cũ
    if (wsRef.current) wsRef.current.close();

    const interval = intervalMap[timeframe] || '1h';
    const symbolLower = symbol.toLowerCase();

    // 1. Fetch lịch sử klines từ REST API
    axios
      .get<Array<[number, string, string, string, string, ...unknown[]]>>(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`
      )
      .then((res) => {
        const formattedData: CandlestickData<Time>[] = res.data.map((d) => ({
          time: Math.floor(d[0] / 1000) as Time,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        candlestickSeriesRef.current?.setData(formattedData);
        chartInstanceRef.current?.timeScale().fitContent();
      })
      .catch((err) => console.error('Lỗi khi lấy klines futures:', err))
      .finally(() => setIsLoading(false));

    // 2. Kết nối WebSocket real-time
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbolLower}@kline_${interval}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event: MessageEvent) => {
      const message: BinanceKlineStream = JSON.parse(event.data);
      const k = message.k;
      // Cập nhật trực tiếp vào chart qua ref, không re-render React
      candlestickSeriesRef.current?.update({
        time: Math.floor(k.t / 1000) as Time,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      });
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [symbol, timeframe]);

  return (
    <div className="flex flex-col h-full bg-[#181a20]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2b313a] text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium cursor-pointer">Đồ thị</span>
          <span className="text-gray-400 cursor-pointer">Thông tin</span>
          <span className="text-gray-400 cursor-pointer">Dữ liệu</span>
        </div>
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded ${
                timeframe === tf ? 'text-[#f0b90b] bg-[#2b313a]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div
        ref={chartContainerRef}
        className="flex-1 w-full relative"
        style={{ minHeight: '400px' }}
      >
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#181a20]/80 z-10 text-gray-400 text-sm"
          >
            Đang tải biểu đồ...
          </div>
        )}
      </div>
    </div>
  );
}