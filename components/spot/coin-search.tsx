'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useCryptoStore } from '@/stores/useCriptoStore';


interface Ticker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
}

const SymbolSearchPanel: React.FC = () => {
  const selectedSymbol = useCryptoStore((state) => state.selectedSymbol);
  const setSelectedSymbol = useCryptoStore((state) => state.setSelectedSymbol);

  const [symbols, setSymbols] = useState<Ticker24hr[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Danh sách coin chỉ cần tải 1 lần lúc mount
  useEffect(() => {
    setIsLoading(true);
    axios
      .get<Ticker24hr[]>('https://api.binance.com/api/v3/ticker/24hr')
      .then((res) => setSymbols(res.data.filter((item) => item.symbol.endsWith('USDT'))))
      .catch((err) => console.error('Lỗi khi lấy danh sách coin:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSymbols = symbols.filter((s) => s.symbol.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ borderTop: '1px solid #2b313a' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #2b313a', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Search size={14} color="#848e9c" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '12px' }}
        />
      </div>
      <div style={{ height: '140px', overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#848e9c', fontSize: '12px' }}>
            Đang tải danh sách coin...
          </div>
        ) : filteredSymbols.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#848e9c', fontSize: '12px' }}>
            Không tìm thấy coin
          </div>
        ) : (
          filteredSymbols.map((item) => {
            const isPositive = parseFloat(item.priceChangePercent) >= 0;
            return (
              <div
                key={item.symbol}
                onClick={() => setSelectedSymbol(item.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  backgroundColor: item.symbol === selectedSymbol ? '#2b313a' : 'transparent',
                }}
              >
                <span style={{ fontWeight: '500' }}>{item.symbol}</span>
                <span>{parseFloat(item.lastPrice).toFixed(2)}</span>
                <span style={{ color: isPositive ? '#0ecb81' : '#f6465d' }}>
                  {isPositive ? '+' : ''}
                  {parseFloat(item.priceChangePercent).toFixed(2)}%
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SymbolSearchPanel;