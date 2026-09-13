'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, User, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/axios';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

type ApiResponse = {
  success: boolean;
  message: string;
  user?: { id: string; name: string; email: string; avatar?: string };
};

declare global {
  interface Window {
    google?: any;
  }
}

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // --- Khai báo State & Ref bị thiếu ---
  const [step, setStep] = useState<'account' | 'password'>('account');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  // ------------------------------------

  const handleAuthSuccess = (data: ApiResponse) => {
    if (data.user) {
      setAuth(data.user);
    }
    router.push('/');
  };

  // Bước 1 -> kiểm tra định dạng rồi chuyển sang nhập mật khẩu
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
    if (!isEmail(account)) {
      setError('Hiện tại hệ thống chỉ hỗ trợ đăng nhập bằng email');
      return;
    }

    setStep('password');
  };

  // Bước 2 -> gọi API đăng nhập mật khẩu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<ApiResponse>('/api/auth/login', { email: account, password, rememberMe });
      const data = res.data;

      if (!data.success) {
        setError(data.message || 'Đăng nhập thất bại, vui lòng thử lại');
        return;
      }

      handleAuthSuccess(data);
    } catch (err) {
      setError('Không thể kết nối đến máy chủ, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  // Gửi idToken của Google về backend
  const sendGoogleToken = async (idToken: string) => {
    setError(null);
    setGoogleLoading(true);
    try {
      const res = await api.post<ApiResponse>('/api/auth/google', { idToken });
      const data = res.data;

      if (!data.success) {
        setError(data.message || 'Đăng nhập bằng Google thất bại');
        return;
      }

      handleAuthSuccess(data);
    } catch (err) {
      setError('Không thể kết nối đến máy chủ, vui lòng thử lại');
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const scriptId = 'google-identity-script';
    const initGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          sendGoogleToken(response.credential);
        },
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      });
    };

    if (document.getElementById(scriptId)) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Thiếu cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }
    const realButton = googleBtnRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLElement | null;
    realButton?.click();
  };

  return (
    <div className="w-full max-w-[430px] bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-[#2b313a] rounded-2xl p-8 space-y-6 shadow-2xl transition-colors duration-200">
      {/* Header Logo & Title */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#F0B90B] rounded-sm flex items-center justify-center font-bold text-black text-xs">
            ❖
          </div>
          <span className="text-[#F0B90B] text-xl font-bold tracking-wider">BINANCE</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {step === 'password' && (
              <button
                type="button"
                onClick={() => {
                  setStep('account');
                  setPassword('');
                  setError(null);
                }}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                aria-label="Quay lại"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Đăng nhập</h1>
          </div>
          <button className="bg-gray-100 dark:bg-[#2b313a] p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <QrCode className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#F6465D]/30 bg-[#F6465D]/10 px-3 py-2 text-sm text-[#F6465D]">
          {error}
        </div>
      )}

      {/* Bước 1: nhập email/sđt */}
      {step === 'account' && (
        <form onSubmit={handleContinue} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Email/Số điện thoại
            </label>
            <Input
              type="text"
              placeholder="Email/Số điện thoại (không có mã quốc gia)"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              autoFocus
              className="w-full bg-gray-50 dark:bg-[#181a20] border-[#F0B90B] focus-visible:ring-1 focus-visible:ring-[#F0B90B] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 rounded-lg text-sm px-4 transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#F0B90B] hover:bg-[#d9a608] text-black font-bold h-12 rounded-lg text-sm transition-colors"
          >
            Tiếp tục
          </Button>
        </form>
      )}

      {/* Bước 2: nhập mật khẩu */}
      {step === 'password' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Đăng nhập với
            </label>
            <div className="w-full h-12 rounded-lg border border-gray-200 dark:border-[#2b313a] bg-gray-50 dark:bg-[#181a20] px-4 flex items-center text-sm text-gray-900 dark:text-white">
              {account}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Mật khẩu
              </label>
              <a href="/forgot-password" className="text-xs text-[#F0B90B] hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-gray-50 dark:bg-[#181a20] border-[#F0B90B] focus-visible:ring-1 focus-visible:ring-[#F0B90B] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-12 rounded-lg text-sm px-4 transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-[#2b313a] accent-[#F0B90B]"
            />
            Duy trì đăng nhập
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F0B90B] hover:bg-[#d9a608] text-black font-bold h-12 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      )}

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-200 dark:border-[#2b313a] w-full" />
        <span className="bg-white dark:bg-[#1e2329] px-3 text-xs text-gray-400 dark:text-gray-500 absolute">
          hoặc
        </span>
      </div>

      {/* Social Logins */}
      <div className="space-y-3">
        <button
          type="button"
          disabled
          title="Tính năng đang được phát triển"
          className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 border border-gray-200 dark:border-[#2b313a] text-gray-400 dark:text-gray-500 h-11 rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
        >
          <User className="w-4 h-4" />
          <span>Tiếp tục với Passkey</span>
        </button>

        {/* Nút Google hiển thị */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={googleLoading}
          className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 hover:bg-gray-100 dark:hover:bg-[#2b313a] border border-gray-200 dark:border-[#2b313a] text-gray-900 dark:text-white h-11 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.6-.5-2.5z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>{googleLoading ? 'Đang xác thực...' : 'Tiếp tục với Google'}</span>
        </button>

        {/* Hidden GSI Container */}
        <div ref={googleBtnRef} className="hidden" />

        <button
          type="button"
          disabled
          title="Tính năng đang được phát triển"
          className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 border border-gray-200 dark:border-[#2b313a] text-gray-400 dark:text-gray-500 h-11 rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.33.13-9.13-1.9-14.39-6.08-3.32-2.61-7.23-7.26-11.72-13.95-6.07-9.06-10.87-19.12-14.39-30.18-3.52-11.07-5.28-21.75-5.28-32.06 0-14.18 3.59-26.04 10.77-35.58 7.18-9.54 16.32-14.4 27.42-14.58 4.67 0 9.87 1.2 15.6 3.59 5.73 2.39 9.69 3.59 11.89 3.59 1.8 0 5.86-1.25 12.18-3.75 6.32-2.5 11.51-3.63 15.58-3.39 12.06.87 21.61 5.39 28.66 13.56-10.77 6.53-16.03 15.63-15.8 27.31.22 9.3 3.8 17.06 10.73 23.28 6.93 6.22 15.22 9.87 24.87 10.96-2.52 7.52-5.91 15.01-10.17 22.48zM119.22 31.8c0-7.07 2.58-13.88 7.74-20.43 5.16-6.55 11.75-10.45 19.77-11.37.11 1.09.16 2.07.16 2.94 0 6.97-2.67 13.87-8.01 20.7-5.34 6.83-11.97 10.71-19.89 11.64-.11-.98-.17-1.94-.17-2.88z" />
          </svg>
          <span>Tiếp tục với Apple</span>
        </button>

        <button
          type="button"
          disabled
          title="Tính năng đang được phát triển"
          className="w-full flex items-center justify-center space-x-3 bg-gray-50 dark:bg-[#2b313a]/40 border border-gray-200 dark:border-[#2b313a] text-gray-400 dark:text-gray-500 h-11 rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
        >
          <Send className="w-4 h-4" />
          <span>Tiếp tục với Telegram</span>
        </button>
      </div>
    </div>
  );
}