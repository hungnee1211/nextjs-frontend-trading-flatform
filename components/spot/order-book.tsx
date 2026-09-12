'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAuthStore } from '@/stores/useAuthStore';
import { useBaseAsset, useCryptoStore } from '@/stores/useCriptoStore';

const OrderFormPanel: React.FC = () => {
  const { user } = useAuthStore();
  const tickerData = useCryptoStore((state) => state.tickerData);
  const baseAsset = useBaseAsset();

  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');

  
  useEffect(() => {
    if (tickerData) {
      setBuyPrice(tickerData.lastPrice);
      setSellPrice(tickerData.lastPrice);
    }
  }, [tickerData?.symbol]);

  const handleBuy = () => {
    if (!user) return;
    alert(`Đặt lệnh MUA thành công ${buyAmount} ${baseAsset} với giá ${buyPrice} USDT`);
  };

  const handleSell = () => {
    if (!user) return;
    alert(`Đặt lệnh BÁN thành công ${sellAmount} ${baseAsset} với giá ${sellPrice} USDT`);
  };

  return (
    <div style={{ borderTop: '1px solid #2b313a', backgroundColor: '#181a20', padding: '12px 20px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderRight: '1px solid #2b313a', paddingRight: '30px' }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 600 }}>
          <span style={{ color: '#fcd535', borderBottom: '2px solid #fcd535', paddingBottom: '4px', cursor: 'pointer' }}>Spot</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', marginTop: '10px', color: '#848e9c' }}>
          <span
            onClick={() => setOrderType('limit')}
            style={{ color: orderType === 'limit' ? '#eaecef' : '#848e9c', cursor: 'pointer', fontWeight: orderType === 'limit' ? 'bold' : 'normal' }}
          >
            Giới hạn
          </span>
          <span
            onClick={() => setOrderType('market')}
            style={{ color: orderType === 'market' ? '#eaecef' : '#848e9c', cursor: 'pointer', fontWeight: orderType === 'market' ? 'bold' : 'normal' }}
          >
            Thị trường
          </span>
        </div>
      </div>

      {/* Khung Mua */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#848e9c' }}>
          <span>
            Khả dụng: <strong style={{ color: '#eaecef' }}>{user ? '10,000.00' : '--'} USDT</strong>
          </span>
        </div>

        {orderType === 'limit' && (
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2b313a', borderRadius: '4px', padding: '6px 10px', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#848e9c' }}>Giá</span>
            <input
              type="text"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'right', outline: 'none', width: '120px', fontSize: '13px' }}
            />
            <span style={{ fontSize: '12px', color: '#848e9c' }}>USDT</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2b313a', borderRadius: '4px', padding: '6px 10px', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#848e9c' }}>Số lượng</span>
          <input
            type="text"
            placeholder="0.00"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'right', outline: 'none', width: '120px', fontSize: '13px' }}
          />
          <span style={{ fontSize: '12px', color: '#848e9c' }}>{baseAsset}</span>
        </div>

        {user ? (
          <button
            onClick={handleBuy}
            style={{ backgroundColor: '#0ecb81', color: '#000', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}
          >
            Mua {baseAsset}
          </button>
        ) : (
          <Link href="/login" className="block w-full text-center">
            <button
              style={{ backgroundColor: '#2b313a', color: '#fcd535', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}
            >
              Đăng nhập để giao dịch
            </button>
          </Link>
        )}
      </div>

      {/* Khung Bán */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#848e9c' }}>
          <span>
            Khả dụng: <strong style={{ color: '#eaecef' }}>{user ? '1.5' : '--'} {baseAsset}</strong>
          </span>
        </div>

        {orderType === 'limit' && (
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2b313a', borderRadius: '4px', padding: '6px 10px', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#848e9c' }}>Giá</span>
            <input
              type="text"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'right', outline: 'none', width: '120px', fontSize: '13px' }}
            />
            <span style={{ fontSize: '12px', color: '#848e9c' }}>USDT</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2b313a', borderRadius: '4px', padding: '6px 10px', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#848e9c' }}>Số lượng</span>
          <input
            type="text"
            placeholder="0.00"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'right', outline: 'none', width: '120px', fontSize: '13px' }}
          />
          <span style={{ fontSize: '12px', color: '#848e9c' }}>{baseAsset}</span>
        </div>

        {user ? (
          <button
            onClick={handleSell}
            style={{ backgroundColor: '#f6465d', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}
          >
            Bán {baseAsset}
          </button>
        ) : (
          <Link href="/login" className="block w-full text-center">
            <button
              style={{ backgroundColor: '#2b313a', color: '#fcd535', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}
            >
              Đăng nhập để giao dịch
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderFormPanel;