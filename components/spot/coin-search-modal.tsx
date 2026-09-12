'use client';

import React, { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { useCryptoStore } from '@/stores/useCriptoStore';


interface Ticker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
}

interface CoinSearchModalProps {
  onClose: () => void;
  // Phần tử neo (nút/tên coin) để tính vị trí đặt popup bên dưới nó.
  anchorRef: RefObject<HTMLElement | null>;
}

const CoinSearchModal: React.FC<CoinSearchModalProps> = ({ onClose, anchorRef }) => {
  const selectedSymbol = useCryptoStore((state) => state.selectedSymbol);
  const setSelectedSymbol = useCryptoStore((state) => state.setSelectedSymbol);

  const [symbols, setSymbols] = useState<Ticker24hr[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Tính toạ độ dựa trên vị trí thật của phần tử neo trên màn hình (viewport),
  // vì popup sẽ được render qua Portal ra thẳng document.body -> không còn
  // bị ảnh hưởng bởi overflow:hidden / position:relative của các thẻ cha nữa.
  useEffect(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ top: rect.bottom + 6, left: rect.left });
    }
  }, [anchorRef]);

  // Tự focus vào ô tìm kiếm khi popup mở ra
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Đóng popup bằng phím Esc cho tiện
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Tải danh sách coin 1 lần khi popup mở (nhẹ, không đụng tới các panel khác)
  useEffect(() => {
    axios
      .get<Ticker24hr[]>('https://api.binance.com/api/v3/ticker/24hr')
      .then((res) => setSymbols(res.data.filter((item) => item.symbol.endsWith('USDT'))))
      .catch((err) => console.error('Lỗi khi lấy danh sách coin:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    onClose();
  };

  const filteredSymbols = symbols.filter((s) => s.symbol.toLowerCase().includes(search.toLowerCase()));

  // Chưa tính được vị trí (lần render đầu) thì chưa hiển thị gì, tránh hiện sai chỗ.
  if (!position || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Lớp phủ để bấm ra ngoài là đóng popup. Render qua Portal ra body nên
          chắc chắn phủ toàn màn hình, không bị kẹt trong container nào cả. */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.3)' }}
      />

      {/* Cửa sổ nhỏ - fixed theo toạ độ thật của nút bấm trên viewport */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          width: '320px',
          maxHeight: '420px',
          backgroundColor: '#181a20',
          border: '1px solid #2b313a',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderBottom: '1px solid #2b313a',
          }}
        >
          <Search size={14} color="#848e9c" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm coin, ví dụ: BTC, ETH..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '13px' }}
          />
          <X size={16} color="#848e9c" style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#848e9c', fontSize: '12px' }}>Đang tải...</div>
          )}

          {!loading && filteredSymbols.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#848e9c', fontSize: '12px' }}>
              Không tìm thấy coin phù hợp
            </div>
          )}

          {filteredSymbols.map((item) => {
            const isPositive = parseFloat(item.priceChangePercent) >= 0;
            return (
              <div
                key={item.symbol}
                onClick={() => handleSelect(item.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  backgroundColor: item.symbol === selectedSymbol ? '#2b313a' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (item.symbol !== selectedSymbol) e.currentTarget.style.backgroundColor = '#1e2329';
                }}
                onMouseLeave={(e) => {
                  if (item.symbol !== selectedSymbol) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontWeight: 500 }}>{item.symbol}</span>
                <span>{parseFloat(item.lastPrice).toFixed(2)}</span>
                <span style={{ color: isPositive ? '#0ecb81' : '#f6465d' }}>
                  {isPositive ? '+' : ''}
                  {parseFloat(item.priceChangePercent).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
};

export default CoinSearchModal;