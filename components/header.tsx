'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Globe, SunMoon, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

export function Header() {
  const router = useRouter();
  
  // Lấy state & hàm logout từ store Zustand
  const { user, logout } = useAuthStore();

  // Tránh lỗi Hydration mismatch giữa Server và Client khi đọc localStorage
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-[#2b313a] bg-white dark:bg-[#181a20] sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-[#F0B90B] text-2xl font-black tracking-wider cursor-pointer">
          BINANCE
        </Link>
        
        <nav className="hidden xl:flex items-center space-x-5 text-sm font-medium text-gray-700 dark:text-gray-200">
          <a href="#" className="hover:text-[#f0b90b]">Mua Crypto</a>
          <Link href="/chart" className="text-[#f0b90b]">Thị trường</Link>
          
          {/* Menu Dropdown Giao Dịch */}
          <div className="relative group py-2">
            <button className="flex items-center space-x-1 hover:text-[#f0b90b] focus:outline-none">
              <span>Giao dịch</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* Popup Form Dropdown */}
            <div className="absolute left-0 top-full hidden group-hover:grid grid-cols-2 gap-x-8 gap-y-4 w-[640px] p-6 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-lg shadow-2xl z-50 text-gray-800 dark:text-gray-200">
              {/* Cột Cơ Bản */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cơ bản</div>
                
                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">📊</div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">Spot</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Giao dịch giao ngay và ký quỹ với các công cụ nâng cao</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">📈</div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      Cổ phiếu <span className="bg-[#f0b90b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">New</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Giao dịch cổ phiếu và ETF bằng tiền mã hóa</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">⚡</div>
                  <div>
                    <div className="font-semibold text-sm">Margin</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tối đa lợi nhuận bằng đòn bẩy cao</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">👥</div>
                  <div>
                    <div className="font-semibold text-sm">P2P</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mua và bán tiền mã hóa bằng chuyển khoản ngân hàng</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🔄</div>
                  <div>
                    <div className="font-semibold text-sm">Chuyển đổi & Giao dịch lô</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Cách dễ nhất để giao dịch ở mọi quy mô</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🎮</div>
                  <div>
                    <div className="font-semibold text-sm">Giao dịch Demo</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Trải nghiệm giao dịch thực tế không gặp rủi ro</div>
                  </div>
                </Link>
              </div>

              {/* Cột Nâng Cao */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nâng cao</div>
                
                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🌐</div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      DEX <span className="bg-[#f0b90b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">Beta</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Giao dịch trên chuỗi với Ví Binance</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🎯</div>
                  <div>
                    <div className="font-semibold text-sm">Binance Alpha</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Truy cập nhanh vào Web3 thông qua Alpha Trading</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🔮</div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      Dự đoán <span className="bg-[#f0b90b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">New</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Dự đoán kết quả, giao dịch tương lai</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🤖</div>
                  <div>
                    <div className="font-semibold text-sm">Bot giao dịch</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Giao dịch thông minh hơn với các chiến lược tự động</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">📋</div>
                  <div>
                    <div className="font-semibold text-sm">Sao chép giao dịch</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Theo dõi các nhà giao dịch nổi tiếng nhất</div>
                  </div>
                </Link>

                <Link href="#" className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors">
                  <div className="text-xl">🔌</div>
                  <div>
                    <div className="font-semibold text-sm">API</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Vô vàn cơ hội khi dùng 1 khóa</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Các item menu còn lại */}
          {['Futures', 'Earn', 'Square', 'AI', 'Nhiều hơn'].map((item) => (
            <button key={item} className="flex items-center space-x-1 hover:text-[#f0b90b]">
              <span>{item}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white" />
        
        {/* Kiểm tra trạng thái Đăng nhập */}
        {isMounted && user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-[#2b313a] px-3 py-1 rounded">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              )}
              <span className="text-xs font-medium text-gray-900 dark:text-white max-w-[120px] truncate">
                {user.name || user.email}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              title="Đăng xuất"
              className="bg-gray-100 dark:bg-[#2b313a] hover:bg-gray-200 dark:hover:bg-[#363c4e] text-gray-900 dark:text-white rounded px-2 py-1 transition-colors"
            >
              <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/login')}
              className="bg-gray-100 dark:bg-[#2b313a] hover:bg-gray-200 dark:hover:bg-[#363c4e] text-gray-900 dark:text-white rounded px-3 py-1 font-medium transition-colors"
            >
              Đăng nhập
            </Button>

            <Button
              size="sm"
              onClick={() => router.push('/register')}
              className="bg-[#F0B90B] hover:bg-[#d9a608] text-black font-semibold rounded px-3 py-1"
            >
              Đăng ký
            </Button>
          </>
        )}

        <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white ml-2" />
        <SunMoon className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white" />
      </div>
    </header>
  );
}