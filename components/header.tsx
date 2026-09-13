'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import {
  Search,
  Globe,
  SunMoon,
  ChevronDown,
  User,
  LogOut,
  ChevronRight,
  Settings,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/axios';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, isInitialized } = useAuthStore();

  const [isMounted, setIsMounted] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      setLogoutOpen(false);
      router.push('/login');
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-[#2b313a] bg-white dark:bg-[#181a20] sticky top-0 z-50 transition-colors duration-200">
      {/* Logo + Navigation */}
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className="text-[#F0B90B] text-2xl font-black tracking-wider cursor-pointer"
        >
          BINANCE
        </Link>

        <nav className="hidden xl:flex items-center space-x-5 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link
            href="#"
            className="hover:text-[#f0b90b]"
          >
            Mua Crypto
          </Link>

          <Link
            href="/chart"
            className={pathname === '/chart' ? 'text-[#f0b90b]' : 'hover:text-[#f0b90b]'}
          >
            Thị trường
          </Link>

          {/* Giao dịch */}
          <div className="relative group py-2">
            <button
              type="button"
              className="flex items-center space-x-1 hover:text-[#f0b90b] focus:outline-none"
            >
              <span>Giao dịch</span>

              <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            <div className="absolute left-0 top-full hidden group-hover:grid grid-cols-2 gap-x-8 gap-y-4 w-[640px] p-6 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-lg shadow-2xl z-50 text-gray-800 dark:text-gray-200">
              {/* Cơ bản */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Cơ bản
                </div>

                <Link
                  href="/transaction/spot"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">📊</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Spot
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Giao dịch giao ngay và ký quỹ với các công cụ nâng cao
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">📈</div>

                  <div>
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      Cổ phiếu

                      <span className="bg-[#f0b90b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                        New
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Giao dịch cổ phiếu và ETF bằng tiền mã hóa
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">⚡</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Margin
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tối đa lợi nhuận bằng đòn bẩy cao
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">👥</div>

                  <div>
                    <div className="font-semibold text-sm">
                      P2P
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Mua và bán tiền mã hóa bằng chuyển khoản ngân hàng
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🔄</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Chuyển đổi & Giao dịch lô
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Cách dễ nhất để giao dịch ở mọi quy mô
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🎮</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Giao dịch Demo
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Trải nghiệm giao dịch thực tế không gặp rủi ro
                    </div>
                  </div>
                </Link>
              </div>

              {/* Nâng cao */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Nâng cao
                </div>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🌐</div>

                  <div>
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      DEX

                      <span className="bg-[#f0b90b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Beta
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Giao dịch trên chuỗi với Ví Binance
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🎯</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Binance Alpha
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Truy cập nhanh vào Web3 thông qua Alpha Trading
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🔮</div>

                  <div>
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      Dự đoán

                      <span className="bg-[#f0b90b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                        New
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Dự đoán kết quả, giao dịch tương lai
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🤖</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Bot giao dịch
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Giao dịch thông minh hơn với các chiến lược tự động
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">📋</div>

                  <div>
                    <div className="font-semibold text-sm">
                      Sao chép giao dịch
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Theo dõi các nhà giao dịch nổi tiếng nhất
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b313a] transition-colors"
                >
                  <div className="text-xl">🔌</div>

                  <div>
                    <div className="font-semibold text-sm">
                      API
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Vô vàn cơ hội khi dùng 1 khóa
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {[
            { label: 'Futures', href: '/transaction/futures' },
            { label: 'Earn', href: '#' },
            { label: 'Square', href: '#' },
            { label: 'AI', href: '#' },
            { label: 'Nhiều hơn', href: '#' },
          ].map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-1 hover:text-[#f0b90b] ${
                  isActive ? 'text-[#f0b90b]' : ''
                }`}
              >
                <span>{item.label}</span>

                <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white" />

        {isMounted && isInitialized ? (
          user ? (
            <div className="flex items-center space-x-3">
              {/* User Popover */}
              <Popover>
                <PopoverTrigger className="flex items-center space-x-2 bg-gray-100 dark:bg-[#2b313a] hover:bg-gray-200 dark:hover:bg-[#363c4e] px-3 py-1 rounded transition-colors focus:outline-none cursor-pointer">
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

                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </PopoverTrigger>

                <PopoverContent className="w-72 p-0 overflow-hidden">
                  {/* User information */}
                  <div className="flex items-center space-x-3 p-4 border-b border-gray-100 dark:border-[#2b313a]">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#2b313a] flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.name || 'Người dùng'}
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2b313a]"
                    >
                      <span className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        Tài khoản của tôi
                      </span>

                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </Link>

                    <Link
                      href="/wallet"
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2b313a]"
                    >
                      <span className="flex items-center gap-3">
                        <Wallet className="w-4 h-4 text-gray-400" />
                        Ví của tôi
                      </span>

                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </Link>

                    <Link
                      href="/security"
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2b313a]"
                    >
                      <span className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        Bảo mật
                      </span>

                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2b313a]"
                    >
                      <span className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-gray-400" />
                        Cài đặt
                      </span>

                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 dark:border-[#2b313a] py-2">
                    <button
                      type="button"
                      onClick={() => setLogoutOpen(true)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-[#2b313a]"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Logout confirmation modal */}
              {logoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-80 p-6 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-gray-200 dark:border-[#2b313a]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Đăng xuất
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLogoutOpen(false)}
                        className="h-8 rounded-lg border-gray-200 dark:border-[#2b313a] bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-[#2b313a] text-gray-900 dark:text-white"
                      >
                        Hủy
                      </Button>

                      <Button
                        size="sm"
                        onClick={handleLogout}
                        className="h-8 rounded-lg bg-[#F0B90B] hover:bg-[#d9a608] text-black font-semibold"
                      >
                        Đăng xuất
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-gray-100 dark:bg-[#2b313a] hover:bg-gray-200 dark:hover:bg-[#363c4e] text-gray-900 dark:text-white rounded px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Đăng nhập
              </Link>

              {/* Register */}
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-[#F0B90B] hover:bg-[#d9a608] text-black font-semibold rounded px-3 py-1.5 text-sm transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-20 h-9 bg-gray-100 dark:bg-[#2b313a] rounded animate-pulse" />

            <div className="w-20 h-9 bg-[#F0B90B] rounded animate-pulse" />
          </div>
        )}

        <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white ml-2" />

        <SunMoon className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white" />
      </div>
    </header>
  );
}