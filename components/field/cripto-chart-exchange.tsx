"use client"
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeries,
  Time,
} from 'lightweight-charts';
import { Search } from 'lucide-react';

// --- INTERFACES & TYPES ---

interface Ticker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
}

interface OrderBookState {
  bids: [string, string][];
  asks: [string, string][];
}

interface BinanceKlineStream {
  k: {
    t: number; // Kline start time
    o: string; // Open price
    h: string; // High price
    l: string; // Low price
    c: string; // Close price
  };
}

interface BinanceDepthStream {
  bids: [string, string][];
  asks: [string, string][];
}

const CryptoExchange: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [symbols, setSymbols] = useState<Ticker24hr[]>([]);
  const [search, setSearch] = useState<string>('');
  const [tickerData, setTickerData] = useState<Ticker24hr | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookState>({ bids: [], asks: [] });

  // Typings cho Chart và Series (lightweight-charts v5 API)
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const wsChartRef = useRef<WebSocket | null>(null);
  const wsOrderBookRef = useRef<WebSocket | null>(null);

  // 1. Lấy danh sách Coin và thông tin Ticker 24h
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await axios.get<Ticker24hr[]>('https://api.binance.com/api/v3/ticker/24hr');
        // Lọc lấy các cặp giao dịch đuôi USDT
        const usdtPairs = res.data.filter((item) => item.symbol.endsWith('USDT'));
        setSymbols(usdtPairs);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách coin:', err);
      }
    };
    fetchSymbols();
  }, []);

  // 2. Khởi tạo Biểu đồ (TradingView Lightweight Charts v5)
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
      },
    });

    chartInstanceRef.current = chart;

    // Cú pháp chuẩn lightweight-charts v5
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: false,
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
    });

    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // 3. Tải lịch sử nến và kết nối WebSocket cho Coin được chọn
  useEffect(() => {
    if (!selectedSymbol || !candlestickSeriesRef.current) return;

    // Lấy dữ liệu 24h ticker của coin hiện tại
    axios
      .get<Ticker24hr>(`https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedSymbol}`)
      .then((res) => setTickerData(res.data))
      .catch((err) => console.error('Lỗi khi lấy dữ liệu ticker:', err));

    // Lấy dữ liệu nến lịch sử (Khung 1 giờ)
    axios
      .get<Array<[number, string, string, string, string, ...unknown[]]>>(
        `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol}&interval=1h&limit=200`
      )
      .then((res) => {
        const formattedData: CandlestickData<Time>[] = res.data.map((d) => ({
          time: (d[0] / 1000) as Time,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        candlestickSeriesRef.current?.setData(formattedData);
      })
      .catch((err) => console.error('Lỗi khi lấy klines:', err));

    // Đóng WebSocket cũ nếu đang bật
    if (wsChartRef.current) wsChartRef.current.close();
    if (wsOrderBookRef.current) wsOrderBookRef.current.close();

    // Kết nối WebSocket Nến thời gian thực
    const klineWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@kline_1h`
    );

    klineWs.onmessage = (event: MessageEvent) => {
      const message: BinanceKlineStream = JSON.parse(event.data);
      const k = message.k;
      candlestickSeriesRef.current?.update({
        time: (k.t / 1000) as Time,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      });
    };
    wsChartRef.current = klineWs;

    // Kết nối WebSocket Sổ lệnh (Order Book)
    const depthWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@depth10@100ms`
    );

    depthWs.onmessage = (event: MessageEvent) => {
      const data: BinanceDepthStream = JSON.parse(event.data);
      setOrderBook({
        bids: data.bids.slice(0, 10),
        asks: data.asks.slice(0, 10),
      });
    };
    wsOrderBookRef.current = depthWs;

    return () => {
      klineWs.close();
      depthWs.close();
    };
  }, [selectedSymbol]);

  // Lọc danh sách Coin dựa trên ô tìm kiếm
  const filteredSymbols = symbols.filter((s) =>
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const priceChangePercent = tickerData ? parseFloat(tickerData.priceChangePercent) : 0;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#181a20', color: '#eaecef', fontFamily: 'sans-serif' }}>
      
      {/* 1. CỘT BÊN TRÁI: SỔ LỆNH (ORDER BOOK) */}
      <div style={{ width: '250px', borderRight: '1px solid #2b313a', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px', fontWeight: 'bold', borderBottom: '1px solid #2b313a' }}>Sổ lệnh</div>
        <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
          {/* Giá Bán (Asks - Màu đỏ) */}
          <div style={{ color: '#f6465d', fontSize: '12px' }}>
            {orderBook.asks.slice().reverse().map(([price, qty], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>{parseFloat(price).toFixed(2)}</span>
                <span>{parseFloat(qty).toFixed(4)}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0', color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
            {tickerData ? parseFloat(tickerData.lastPrice).toFixed(2) : '--'}
          </div>

          {/* Giá Mua (Bids - Màu xanh) */}
          <div style={{ color: '#0ecb81', fontSize: '12px' }}>
            {orderBook.bids.map(([price, qty], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>{parseFloat(price).toFixed(2)}</span>
                <span>{parseFloat(qty).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC CHÍNH: BIỂU ĐỒ & THÔNG TIN COIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header thông tin coin */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #2b313a', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{selectedSymbol}</h2>
          <div>
            <div style={{ fontSize: '12px', color: '#848e9c' }}>Giá gần nhất</div>
            <div style={{ fontWeight: 'bold', color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
              ${tickerData ? parseFloat(tickerData.lastPrice).toLocaleString() : '--'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#848e9c' }}>Biến động 24h</div>
            <div style={{ color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
              {tickerData ? `${parseFloat(tickerData.priceChangePercent).toFixed(2)}%` : '--'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#848e9c' }}>Khối lượng 24h</div>
            <div>{tickerData ? parseFloat(tickerData.volume).toLocaleString() : '--'}</div>
          </div>
        </div>

        {/* Khung Biểu đồ */}
        <div ref={chartContainerRef} style={{ flex: 1, width: '100%' }} />
      </div>

      {/* 3. CỘT BÊN PHẢI: DANH SÁCH COIN */}
      <div style={{ width: '280px', borderLeft: '1px solid #2b313a', display: 'flex', flexDirection: 'column' }}>
        {/* Thanh tìm kiếm */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #2b313a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} color="#848e9c" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
          />
        </div>

        {/* Danh sách */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredSymbols.map((item) => {
            const isPositive = parseFloat(item.priceChangePercent) >= 0;
            return (
              <div
                key={item.symbol}
                onClick={() => setSelectedSymbol(item.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  backgroundColor: item.symbol === selectedSymbol ? '#2b313a' : 'transparent',
                }}
              >
                <span style={{ fontWeight: '500' }}>{item.symbol}</span>
                <span>{parseFloat(item.lastPrice).toFixed(2)}</span>
                <span style={{ color: isPositive ? '#0ecb81' : '#f6465d' }}>
                  {isPositive ? '+' : ''}{parseFloat(item.priceChangePercent).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CryptoExchange;