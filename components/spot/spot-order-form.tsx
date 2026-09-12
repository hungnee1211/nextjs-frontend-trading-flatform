'use client';

import { useCryptoStore } from '@/stores/useCriptoStore';
import React, { useEffect, useRef, useState } from 'react';


interface OrderBookState {
  bids: [string, string][];
  asks: [string, string][];
}

interface BinanceDepthStream {
  bids: [string, string][];
  asks: [string, string][];
}

const OrderBookPanel: React.FC = () => {
  const selectedSymbol = useCryptoStore((state) => state.selectedSymbol);
  const tickerData = useCryptoStore((state) => state.tickerData);

  // bids/asks đổi liên tục (nhiều lần/giây) và chỉ panel này cần hiển thị
  // -> để useState cục bộ, không đưa vào Zustand global.
  const [orderBook, setOrderBook] = useState<OrderBookState>({ bids: [], asks: [] });
  const wsOrderBookRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedSymbol) return;

    if (wsOrderBookRef.current) wsOrderBookRef.current.close();
    setOrderBook({ bids: [], asks: [] });

    const symbolLower = selectedSymbol.toLowerCase();
    const depthWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolLower}@depth10@100ms`);
    depthWs.onmessage = (event: MessageEvent) => {
      const data: BinanceDepthStream = JSON.parse(event.data);
      setOrderBook({ bids: data.bids.slice(0, 10), asks: data.asks.slice(0, 10) });
    };
    wsOrderBookRef.current = depthWs;

    return () => {
      depthWs.close();
    };
  }, [selectedSymbol]);

  const priceChangePercent = tickerData ? parseFloat(tickerData.priceChangePercent) : 0;

  return (
    <div
      style={{
        width: '250px',
        borderRight: '1px solid #2b313a',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#181a20',
      }}
    >
      <div style={{ padding: '10px 12px', fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #2b313a' }}>
        Sổ lệnh
      </div>
      <div
        style={{
          flex: 1,
          padding: '4px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#f6465d', fontSize: '12px' }}>
          {orderBook.asks
            .slice()
            .reverse()
            .map(([price, qty], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>{parseFloat(price).toFixed(2)}</span>
                <span>{parseFloat(qty).toFixed(4)}</span>
              </div>
            ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '6px 0',
            borderTop: '1px solid #2b313a',
            borderBottom: '1px solid #2b313a',
            padding: '4px 0',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
            {tickerData ? parseFloat(tickerData.lastPrice).toFixed(2) : '--'}
          </span>
          <span style={{ fontSize: '12px', color: priceChangePercent >= 0 ? '#0ecb81' : '#f6465d' }}>
            {priceChangePercent >= 0 ? '↑' : '↓'}
          </span>
        </div>

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
  );
};

export default OrderBookPanel;