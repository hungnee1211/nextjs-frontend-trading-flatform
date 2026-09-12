'use client';

import { LoginForm } from '@/components/auth/login-form';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';


export default function LoginPage() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized && user) {
      router.push('/');
    }
  }, [mounted, isInitialized, user, router]);

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#181a20] flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
        <div className="w-full max-w-[430px] space-y-4">
          <div className="h-12 bg-gray-100 dark:bg-[#2b313a] rounded-lg animate-pulse" />
          <div className="h-12 bg-gray-100 dark:bg-[#2b313a] rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#181a20] flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      {/* Login Card */}
      <LoginForm />

      {/* Bottom Footer Links */}
      <div className="mt-8 space-y-3 text-center text-xs">
        <div>
          <Link href="/register" className="text-[#F0B90B] hover:underline font-medium">
            Tạo tài khoản Binance
          </Link>
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