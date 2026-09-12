'use client';

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
import { ChevronDown } from 'lucide-react';
import { useCryptoStore } from '@/stores/useCriptoStore';
import CoinSearchModal from './coin-search-modal';

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

const ChartPanel: React.FC = () => {
  // Chỉ subscribe đúng phần cần: đổi symbol thì tự fetch/kết nối lại.
  const selectedSymbol = useCryptoStore((state) => state.selectedSymbol);
  const tickerData = useCryptoStore((state) => state.tickerData);
  const setTickerData = useCryptoStore((state) => state.setTickerData);

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const wsChartRef = useRef<WebSocket | null>(null);

  // Chỉ panel này cần biết popup tìm coin đang mở hay đóng -> state cục bộ.
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  // Ref của phần tên coin, dùng để tính vị trí đặt popup (vì popup render qua Portal).
  const symbolLabelRef = useRef<HTMLHeadingElement | null>(null);

  // Khởi tạo chart 1 lần duy nhất khi mount
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#12161c' }, textColor: '#848e9c' },
      grid: {
        vertLines: { color: '#1e2329' },
        horzLines: { color: '#1e2329' },
      },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#2b313a' },
      rightPriceScale: { borderColor: '#2b313a' },
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

  // Tải dữ liệu & mở WebSocket kline mỗi khi đổi symbol
  useEffect(() => {
    if (!selectedSymbol || !candlestickSeriesRef.current) return;

    if (wsChartRef.current) wsChartRef.current.close();

    axios
      .get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedSymbol}`)
      .then((res) => setTickerData(res.data))
      .catch((err) => console.error('Lỗi khi lấy dữ liệu ticker:', err));

    axios
      .get<Array<[number, string, string, string, string, ...unknown[]]>>(
        `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol}&interval=1h&limit=200`
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
      .catch((err) => console.error('Lỗi khi lấy klines:', err));

    const symbolLower = selectedSymbol.toLowerCase();
    const klineWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolLower}@kline_1h`);
    klineWs.onmessage = (event: MessageEvent) => {
      const message: BinanceKlineStream = JSON.parse(event.data);
      const k = message.k;
      // Cập nhật trực tiếp vào chart qua ref, KHÔNG qua React state.
      // Đây là điểm tối ưu quan trọng nhất: nến cập nhật liên tục nhưng
      // không hề khiến React re-render.
      candlestickSeriesRef.current?.update({
        time: Math.floor(k.t / 1000) as Time,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      });
    };
    wsChartRef.current = klineWs;

    return () => {
      klineWs.close();
    };
  }, [selectedSymbol, setTickerData]);

  const priceChangePercent = tickerData ? parseFloat(tickerData.priceChangePercent) : 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
      <div
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid #2b313a',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          backgroundColor: '#181a20',
          zIndex: 2,
        }}
      >
        <h2
          ref={symbolLabelRef}
          onClick={() => setIsSearchOpen((prev) => !prev)}
          style={{
            margin: 0,
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {selectedSymbol} <span style={{ fontSize: '12px', color: '#848e9c', fontWeight: 'normal' }}>Spot</span>
          <ChevronDown size={16} color="#848e9c" style={{ transform: isSearchOpen ? 'rotate(180deg)' : 'none' }} />
        </h2>

        {isSearchOpen && <CoinSearchModal anchorRef={symbolLabelRef} onClose={() => setIsSearchOpen(false)} />}
        <div>
          <div style={{ fontSize: '11px', color: '#848e9c' }}>Giá gần nhất</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
            ${tickerData ? parseFloat(tickerData.lastPrice).toLocaleString() : '--'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#848e9c' }}>Biến động 24h</div>
          <div style={{ fontSize: '13px', color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
            {tickerData ? `${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%` : '--'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#848e9c' }}>Khối lượng 24h</div>
          <div style={{ fontSize: '13px' }}>{tickerData ? parseFloat(tickerData.volume).toLocaleString() : '--'}</div>
        </div>
      </div>

      <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />
      </div>
    </div>
  );
};

export default ChartPanel;