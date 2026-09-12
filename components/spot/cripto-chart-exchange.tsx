'use client';

import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import SymbolSearchPanel from './coin-search';
import ChartPanel from './crypto-chart';
import OrderFormPanel from './order-book';
import OrderBookPanel from './spot-order-form';
import TradesPanel from './trade-list';


const CryptoExchange: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#181a20', color: '#eaecef', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* 1. KHU VỰC TRÊN */}
      <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0 }}>
        <OrderBookPanel />
        <ChartPanel />

        <div style={{ width: '280px', borderLeft: '1px solid #2b313a', display: 'flex', flexDirection: 'column', backgroundColor: '#181a20' }}>
          <TradesPanel />
          <SymbolSearchPanel />
        </div>
      </div>

      {/* 2. KHU VỰC DƯỚI: FORM ĐẶT LỆNH SPOT */}
      <OrderFormPanel />

      {/* 3. FOOTER STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 16px', backgroundColor: '#12161c', borderTop: '1px solid #2b313a', fontSize: '11px', color: '#848e9c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#0ecb81', borderRadius: '50%' }}></span>
          <span>Kết nối ổn định {user && `| Đang đăng nhập: ${user.name}`}</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {user && <span onClick={logout} style={{ color: '#f6465d', cursor: 'pointer' }}>Đăng xuất</span>}
          <span>Hỗ trợ</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;