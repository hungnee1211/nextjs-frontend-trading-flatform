'use client';

import { RegisterBanner } from '@/components/form/register-banner';
import { RegisterForm } from '@/components/form/register-form';
import { SupportButton } from '@/components/support-button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function RegisterPage() {
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
      <div className="min-h-screen bg-white dark:bg-[#181a20] flex items-center justify-center px-6 py-12 relative transition-colors duration-200">
        <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[480px] space-y-4">
              <div className="h-10 bg-gray-100 dark:bg-[#2b313a] rounded-lg animate-pulse" />
              <div className="h-40 bg-gray-100 dark:bg-[#2b313a] rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[430px] space-y-4">
              <div className="h-12 bg-gray-100 dark:bg-[#2b313a] rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-100 dark:bg-[#2b313a] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#181a20] flex items-center justify-center px-6 py-12 relative transition-colors duration-200">
      <main className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Banner */}
        <div className="flex justify-center lg:justify-start">
          <RegisterBanner />
        </div>

        {/* Right Column - Form */}
        <div className="flex justify-center lg:justify-end">
          <RegisterForm />
        </div>
      </main>

      {/* Floating Support Icon */}
      <SupportButton />
    </div>
  );
}