"use client"
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

export default function PositionContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Vị thế(0)', 'Giao dịch đang chờ khớp lệnh(0)', 'Lịch sử lệnh', 'Lịch sử giao dịch', 'Lịch sử thay đổi số dư', 'Lịch sử vị thế', 'Bot', 'Tài sản'];
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized || !user) {
    return (
      <div className="bg-[#181a20] text-xs flex flex-col min-h-[180px]">
        <div className="flex items-center space-x-6 px-4 border-b border-[#2b313a] overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`py-2.5 whitespace-nowrap border-b-2 font-medium transition ${
                activeTab === idx ? 'border-[#f0b90b] text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-gray-400 space-y-2">
          <div>
            <Link href="/login" className="text-[#f0b90b] hover:underline">Đăng nhập</Link> hoặc{' '}
            <Link href="/register" className="text-[#f0b90b] hover:underline">Đăng ký ngay</Link> để giao dịch
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181a20] text-xs flex flex-col min-h-[180px]">
      {/* Tabs thanh điều hướng dưới */}
      <div className="flex items-center space-x-6 px-4 border-b border-[#2b313a] overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`py-2.5 whitespace-nowrap border-b-2 font-medium transition ${
              activeTab === idx ? 'border-[#f0b90b] text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nội dung khi đã đăng nhập */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 text-gray-400 space-y-2">
        <div>Chào mừng, {user.name}</div>
        <div>Chưa có vị thế nào</div>
      </div>
    </div>
  );
}