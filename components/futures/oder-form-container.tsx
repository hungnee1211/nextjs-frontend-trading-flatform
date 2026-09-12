"use client"
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

export default function OrderFormContainer() {
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop'>('stop');
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized || !user) {
    return (
      <div className="flex flex-col h-full bg-[#1e2329] p-3 text-xs text-gray-300 space-y-3">
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
          <Link href="/login" className="text-[#f0b90b] hover:underline">Đăng nhập</Link> hoặc{' '}
          <Link href="/register" className="text-[#f0b90b] hover:underline">Đăng ký ngay</Link> để giao dịch
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e2329] p-3 text-xs text-gray-300 space-y-3">
      {/* Cấu hình đòn bẩy & chế độ */}
      <div className="flex items-center justify-between">
        <button className="bg-[#2b313a] text-white px-2 py-1 rounded hover:bg-gray-700">Cross</button>
        <button className="bg-[#2b313a] text-[#f0b90b] px-2 py-1 rounded font-bold hover:bg-gray-700">20x</button>
      </div>

      {/* Số dư khả dụng */}
      <div className="flex justify-between">
        <span className="text-gray-400">Số dư khả dụng</span>
        <span className="text-white">-- USDT</span>
      </div>

      {/* Loại lệnh: Giới hạn / Thị trường / Có điều kiện */}
      <div className="flex space-x-3 border-b border-[#2b313a] pb-2">
        <span className="cursor-pointer text-gray-400 hover:text-white">Giới hạn</span>
        <span className="cursor-pointer text-gray-400 hover:text-white">Thị trường</span>
        <span className="cursor-pointer text-[#f0b90b] border-b-2 border-[#f0b90b] pb-1 font-medium">Có điều kiện</span>
      </div>

      {/* Form nhập liệu */}
      <div className="space-y-2">
        <div>
          <label className="text-gray-400 text-[10px]">Giá Stop</label>
          <div className="flex items-center bg-[#2b313a] rounded px-2 py-1.5 mt-1">
            <input type="text" placeholder="Gần nhất" className="bg-transparent w-full focus:outline-none text-white" />
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-[10px]">Giá</label>
          <div className="flex items-center bg-[#2b313a] rounded px-2 py-1.5 mt-1 justify-between">
            <input type="text" defaultValue="77.278,2" className="bg-transparent w-full focus:outline-none text-white" />
            <span className="text-gray-400">USDT</span>
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-[10px]">Số lượng</label>
          <div className="flex items-center bg-[#2b313a] rounded px-2 py-1.5 mt-1 justify-between">
            <input type="text" placeholder="0" className="bg-transparent w-full focus:outline-none text-white" />
            <span className="text-gray-400">BTC</span>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="space-y-2 pt-2">
        <button className="w-full bg-[#f0b90b] text-black font-bold py-2.5 rounded hover:bg-[#fcd535] transition">
          Đặt lệnh
        </button>
      </div>
    </div>
  );
}