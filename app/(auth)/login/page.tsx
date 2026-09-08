'use client';

import { LoginForm } from '@/components/form/login-form';
import React from 'react';


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#181a20] flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      {/* Login Card */}
      <LoginForm />

      {/* Bottom Footer Links */}
      <div className="mt-8 space-y-3 text-center text-xs">
        <div>
          <a href="#" className="text-[#F0B90B] hover:underline font-medium">
            Tạo tài khoản Binance
          </a>
        </div>
        <div>
          <a href="#" className="text-[#F0B90B] hover:underline font-medium">
            Không thể đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}