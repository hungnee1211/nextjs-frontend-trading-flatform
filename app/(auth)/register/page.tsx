'use client';

import { RegisterBanner } from '@/components/form/register-banner';
import { RegisterForm } from '@/components/form/register-form';
import { SupportButton } from '@/components/support-button';
import React from 'react';


export default function RegisterPage() {
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