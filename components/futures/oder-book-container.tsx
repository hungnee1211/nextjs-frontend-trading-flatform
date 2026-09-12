"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface OrderBookItem {
  price: string;
  qty: string;
  total: string;
}

interface BinanceDepthStream {
  bids: [string, string][];
  asks: [string, string][];
}

export default function OrderBookContainer() {
  const { user, isInitialized } = useAuthStore();
  const [tab, setTab] = useState<'orderbook' | 'trades'>('orderbook');
  const [asks, setAsks] = useState<OrderBookItem[]>([]);
  const [bids, setBids] = useState<OrderBookItem[]>([]);
  const [currentPrice, setCurrentPrice] = useState<string>('--');
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Kết nối WebSocketDepth để lấy dữ liệu real-time
  useEffect(() => {
    const symbolLower = 'btcusdt';
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbolLower}@depth10@100ms`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event: MessageEvent) => {
      const data: BinanceDepthStream = JSON.parse(event.data);
      const newAsks = data.asks.slice(0, 10).map(([price, qty]) => ({
        price,
        qty,
        total: (parseFloat(price) * parseFloat(qty)).toFixed(2),
      }));
      const newBids = data.bids.slice(0, 10).map(([price, qty]) => ({
        price,
        qty,
        total: (parseFloat(price) * parseFloat(qty)).toFixed(2),
      }));
      setAsks(newAsks.reverse());
      setBids(newBids);
      if (newBids.length > 0) {
        setCurrentPrice(newBids[0].price);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const formatPrice = (p: string) => parseFloat(p).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col h-full bg-[#181a20] text-xs">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2b313a]">
        <span className="text-white font-medium">Sổ lệnh</span>
        <div className="flex space-x-2 text-gray-400">
          <button className="hover:text-white">⚙️</button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex justify-between px-3 py-1 text-[10px] text-gray-500 border-b border-[#2b313a]/50">
        <span>Giá</span>
        <span>SL</span>
        <span>Tổng</span>
      </div>

      {/* Sổ lệnh phần Bán (Asks) - Đỏ */}
      <div className="flex-1 p-1 space-y-0.5 overflow-hidden flex flex-col justify-end">
        {asks.map((item, i) => (
          <div key={i} className="flex justify-between text-[11px] relative">
            <span className="text-[#f6465d]">{formatPrice(item.price)}</span>
            <span className="text-gray-300">{parseFloat(item.qty).toFixed(4)}</span>
            <span className="text-gray-500">{parseFloat(item.total).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Giá hiện tại ở giữa */}
      <div className="py-1.5 px-3 bg-[#1e2329] flex items-center justify-between border-y border-[#2b313a]">
        <div className="flex items-center space-x-1 text-sm font-bold text-[#0ecb81]">
          <span>{formatPrice(currentPrice)}</span>
          <span>↑</span>
        </div>
      </div>

      {/* Sổ lệnh phần Mua (Bids) - Xanh */}
      <div className="flex-1 p-1 space-y-0.5 overflow-hidden">
        {bids.map((item, i) => (
          <div key={i} className="flex justify-between text-[11px] relative">
            <span className="text-[#0ecb81]">{formatPrice(item.price)}</span>
            <span className="text-gray-300">{parseFloat(item.qty).toFixed(4)}</span>
            <span className="text-gray-500">{parseFloat(item.total).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}