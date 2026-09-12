'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
  const [account, setAccount] = useState('');
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tạo tài khoản:', account, 'Đồng ý điều khoản:', agreed);
  };

  return (
    <div className="w-full max-w-[430px] bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#2b313a] rounded-2xl p-8 space-y-6 shadow-2xl transition-colors duration-200">
      {/* Header Logo & Title */}
      <div className="space-y-5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#F0B90B] rounded-sm flex items-center justify-center font-bold text-black text-xs">
            ❖
          </div>
          <span className="text-[#F0B90B] text-xl font-bold tracking-wider">BINANCE</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
          Chào mừng đến với Binance
        </h2>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email/Số điện thoại</label>
          <Input
            type="text"
            placeholder="Email/Số điện thoại (không có mã quốc gia)"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#181a20] border-[#F0B90B] focus-visible:ring-1 focus-visible:ring-[#F0B90B] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 rounded-lg text-sm px-4 transition-colors"
          />
        </div>

        {/* Checkbox Policy */}
        <div className="flex items-start space-x-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#181a20] text-[#F0B90B] focus:ring-[#F0B90B] accent-[#F0B90B]"
          />
          <label htmlFor="terms" className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight cursor-pointer">
            Khi tạo tài khoản, tức là tôi đồng ý với{' '}
            <a href="#" className="underline hover:text-gray-900 dark:hover:text-white">Thông báo về quyền riêng tư</a> của Binance.
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#F0B90B] hover:bg-[#d9a608] text-black font-bold h-12 rounded-lg text-sm transition-colors mt-2"
        >
          Đăng ký
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-200 dark:border-[#2b313a] w-full" />
        <span className="bg-white dark:bg-[#1e2329] px-3 text-xs text-gray-400 dark:text-gray-500 absolute">hoặc</span>
      </div>

      {/* Social Register */}
      <div className="space-y-3">
        {/* Google */}
        <button className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 hover:bg-gray-100 dark:hover:bg-[#2b313a] border border-gray-200 dark:border-[#2b313a] text-gray-900 dark:text-white h-11 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.6-.5-2.5z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
          </svg>
          <span>Tiếp tục với Google</span>
        </button>

        {/* Apple */}
        <button className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 hover:bg-gray-100 dark:hover:bg-[#2b313a] border border-gray-200 dark:border-[#2b313a] text-gray-900 dark:text-white h-11 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.33.13-9.13-1.9-14.39-6.08-3.32-2.61-7.23-7.26-11.72-13.95-6.07-9.06-10.87-19.12-14.39-30.18-3.52-11.07-5.28-21.75-5.28-32.06 0-14.18 3.59-26.04 10.77-35.58 7.18-9.54 16.32-14.4 27.42-14.58 4.67 0 9.87 1.2 15.6 3.59 5.73 2.39 9.69 3.59 11.89 3.59 1.8 0 5.86-1.25 12.18-3.75 6.32-2.5 11.51-3.63 15.58-3.39 12.06.87 21.61 5.39 28.66 13.56-10.77 6.53-16.03 15.63-15.8 27.31.22 9.3 3.8 17.06 10.73 23.28 6.93 6.22 15.22 9.87 24.87 10.96-2.52 7.52-5.91 15.01-10.17 22.48zM119.22 31.8c0-7.07 2.58-13.88 7.74-20.43 5.16-6.55 11.75-10.45 19.77-11.37.11 1.09.16 2.07.16 2.94 0 6.97-2.67 13.87-8.01 20.7-5.34 6.83-11.97 10.71-19.89 11.64-.11-.98-.17-1.94-.17-2.88z" />
          </svg>
          <span>Tiếp tục với Apple</span>
        </button>

        {/* Telegram */}
        <button className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 hover:bg-gray-100 dark:hover:bg-[#2b313a] border border-gray-200 dark:border-[#2b313a] text-gray-900 dark:text-white h-11 rounded-lg text-sm font-medium transition-colors">
          <Send className="w-4 h-4 text-[#2AABEE]" />
          <span>Tiếp tục với Telegram</span>
        </button>
      </div>
    </div>
  );
}
