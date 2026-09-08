'use client';

import React from 'react';
import { Trophy, ShieldCheck, Link2 } from 'lucide-react';

export function RegisterBanner() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-[480px]">
      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
        Phần thưởng đăng ký lên <br /> đến <span className="text-[#F0B90B]">100 USD</span>
      </h1>

      {/* Gift Box Graphic */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#F0B90B]/10 rounded-full blur-2xl" />
        <svg className="w-40 h-40 relative z-10" viewBox="0 0 200 200" fill="none">
          {/* Box Base */}
          <rect x="50" y="110" width="100" height="60" rx="6" fill="#1E2329" stroke="#F0B90B" strokeWidth="3" />
          {/* Lid */}
          <path d="M40 95 L160 85 L155 110 L45 110 Z" fill="#2B313A" stroke="#F0B90B" strokeWidth="3" />
          {/* Ribbon */}
          <rect x="92" y="110" width="16" height="60" fill="#F0B90B" />
          {/* Coin inside */}
          <circle cx="100" cy="115" r="24" fill="#F0B90B" />
          <text x="100" y="123" textAnchor="middle" fill="#000" fontSize="22" fontWeight="bold">$</text>
          {/* Confetti */}
          <circle cx="150" cy="60" r="4" fill="#F0B90B" />
          <path d="M160 100 L170 110" stroke="#F0B90B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Trust Stats List */}
      <div className="space-y-4 text-left w-full text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          <Trophy className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
          <span><strong className="text-gray-900 dark:text-white">327,913,129</strong> người dùng tin tưởng Binance</span>
        </div>

        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
          <span>Số 1 về khối lượng giao dịch và tài sản khách hàng</span>
        </div>

        <div className="flex items-start space-x-3">
          <Link2 className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
          <div>
            <span>Quỹ SAFU 1,000,000,000 USDC</span>
            <div className="text-[11px] text-[#F0B90B] mt-0.5">
              Ví SAFU: <a href="#" className="underline break-all">0x420ef1f25563593aF5FE3f9b9d3bC56a8bd8c104</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}