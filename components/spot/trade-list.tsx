'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { useAuthStore } from '@/stores/useAuthStore';
import { useBaseAsset, useCryptoStore } from '@/stores/useCriptoStore';

interface TradeItem {
  id: number;
  price: string;
  qty: string;
  time: string;
  isBuyerMaker: boolean;
}

const TradesPanel: React.FC = () => {
  const { user } = useAuthStore();
  const selectedSymbol = useCryptoStore((state) => state.selectedSymbol);
  const baseAsset = useBaseAsset();

  const [marketTab, setMarketTab] = useState<'marketTrades' | 'myTrades'>('marketTrades');
  const [recentTrades, setRecentTrades] = useState<TradeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const wsTradesRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedSymbol) return;

    setIsLoading(true);
    
    if (wsTradesRef.current) wsTradesRef.current.close();
    setRecentTrades([]);

    axios
      .get<any[]>(`https://api.binance.com/api/v3/trades?symbol=${selectedSymbol}&limit=20`)
      .then((res) => {
        const formatted: TradeItem[] = res.data.map((t) => ({
          id: t.id,
          price: t.price,
          qty: t.qty,
          time: new Date(t.time).toLocaleTimeString(),
          isBuyerMaker: t.isBuyerMaker,
        }));
        setRecentTrades(formatted.reverse());
      })
      .catch((err) => console.error('Lỗi lấy trades:', err))
      .finally(() => setIsLoading(false));

    const symbolLower = selectedSymbol.toLowerCase();
    const tradeWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolLower}@trade`);
    tradeWs.onmessage = (event: MessageEvent) => {
      const t = JSON.parse(event.data);
      const newTrade: TradeItem = {
        id: t.t,
        price: t.p,
        qty: t.q,
        time: new Date(t.T).toLocaleTimeString(),
        isBuyerMaker: t.m,
      };
      setRecentTrades((prev) => [newTrade, ...prev.slice(0, 19)]);
    };
    wsTradesRef.current = tradeWs;

    return () => {
      tradeWs.close();
    };
  }, [selectedSymbol]);

  return (
    <>
      <div style={{ display: 'flex', borderBottom: '1px solid #2b313a', fontSize: '13px' }}>
        <button
          onClick={() => setMarketTab('marketTrades')}
          style={{
            flex: 1,
            padding: '10px',
            background: 'transparent',
            border: 'none',
            color: marketTab === 'marketTrades' ? '#fcd535' : '#848e9c',
            borderBottom: marketTab === 'marketTrades' ? '2px solid #fcd535' : 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Thị trường giao dịch
        </button>
        <button
          onClick={() => setMarketTab('myTrades')}
          style={{
            flex: 1,
            padding: '10px',
            background: 'transparent',
            border: 'none',
            color: marketTab === 'myTrades' ? '#fcd535' : '#848e9c',
            borderBottom: marketTab === 'myTrades' ? '2px solid #fcd535' : 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Giao dịch của tôi
        </button>
      </div>

      {marketTab === 'marketTrades' ? (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 12px',
              fontSize: '11px',
              color: '#848e9c',
              borderBottom: '1px solid #2b313a',
            }}
          >
            <span>Giá (USDT)</span>
            <span>Số lượng ({baseAsset})</span>
            <span>Thời gian</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#848e9c', fontSize: '12px' }}>
                Đang tải lịch sử giao dịch...
              </div>
            ) : recentTrades.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#848e9c', fontSize: '12px' }}>
                Chưa có dữ liệu giao dịch
              </div>
            ) : (
              recentTrades.map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 8px', fontSize: '12px' }}>
                  <span style={{ color: t.isBuyerMaker ? '#f6465d' : '#0ecb81', fontWeight: 500 }}>
                    {parseFloat(t.price).toFixed(2)}
                  </span>
                  <span style={{ color: '#eaecef' }}>{parseFloat(t.qty).toFixed(4)}</span>
                  <span style={{ color: '#848e9c' }}>{t.time}</span>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#848e9c',
            fontSize: '13px',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          {user ? (
            <div>
              Xin chào, <strong style={{ color: '#fcd535' }}>{user.name}</strong>. Chưa có lịch sử giao dịch.
            </div>
          ) : (
            <div>
              Vui lòng <Link href="/login" className="text-[#fcd535] hover:underline cursor-pointer mx-1">Đăng nhập</Link> để xem lịch sử
              giao dịch cá nhân.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TradesPanel;